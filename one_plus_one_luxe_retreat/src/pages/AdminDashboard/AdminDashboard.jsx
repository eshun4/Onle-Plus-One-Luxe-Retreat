import { useCallback, useEffect, useMemo, useState } from 'react';
import settings from '../../settings/settings.jsx';
import {
  cancelManualBlock,
  createManualBlock,
  getAdminReservations,
  getChannelConnections,
  getManualBlocks,
  syncChannel,
} from '../../lib/adminApi.js';
import './AdminDashboard.css';

const navItems = [
  { id: 'overview', label: 'Overview', icon: '◇' },
  { id: 'reservations', label: 'Reservations', icon: '▦' },
  { id: 'channels', label: 'Channels', icon: '↔' },
  { id: 'manual-blocks', label: 'Manual Blocks', icon: '■' },
];

function formatDate(value) {
  if (!value) return '—';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value) {
  if (!value) return 'Never';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatMoney(cents, currency = 'USD') {
  const amount = Number(cents || 0) / 100;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

function normalizeChannels(data) {
  return data.channel_connections || data.connections || data.channels || [];
}

function getStatusClass(status) {
  if (status === 'confirmed' || status === 'active' || status === 'success') {
    return 'green';
  }

  if (status === 'pending' || status === 'running' || status === 'skipped') {
    return 'orange';
  }

  if (status === 'cancelled' || status === 'failed') {
    return 'red';
  }

  return 'blue';
}

function sourceLabel(source) {
  const labels = {
    direct: 'Direct Website',
    booking_com: 'Booking.com',
    airbnb: 'Airbnb',
    vrbo: 'Vrbo',
    manual: 'Manual',
  };

  return labels[source] || source || 'Unknown';
}

export default function AdminDashboard({ currentUser, onSignOut }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [reservations, setReservations] = useState([]);
  const [manualBlocks, setManualBlocks] = useState([]);
  const [channels, setChannels] = useState([]);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [syncingChannel, setSyncingChannel] = useState('');
  const [manualForm, setManualForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  const themeStyle = {
    '--admin-black': settings.colors?.black || '#101010',
    '--admin-surface': settings.colors?.surface || '#171514',
    '--admin-surface-2': settings.colors?.surface2 || '#24201d',
    '--admin-copper': settings.colors?.copper || '#b87333',
    '--admin-copper-light': settings.colors?.copperLight || '#d9a15f',
    '--admin-sand': settings.colors?.sand || '#d8c3a5',
    '--admin-cream': settings.colors?.cream || '#f5efe6',
    '--admin-muted': settings.colors?.muted || '#9b9188',
    '--admin-font-display': settings.typography?.display || '"Bebas Neue", sans-serif',
    '--admin-font-body': settings.typography?.body || '"Instrument Sans", sans-serif',
  };

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [reservationsData, channelsData, manualBlocksData] = await Promise.all([
        getAdminReservations(),
        getChannelConnections(),
        getManualBlocks(),
      ]);

      setReservations(reservationsData.reservations || []);
      setChannels(normalizeChannels(channelsData));
      setManualBlocks(manualBlocksData.manual_blocks || []);
      setProperty(
        reservationsData.property ||
          manualBlocksData.property ||
          channelsData.property ||
          null
      );
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = useMemo(() => {
    const activeReservations = reservations.filter((reservation) =>
      ['pending', 'confirmed'].includes(reservation.status)
    );

    const activeManualBlocks = manualBlocks.filter(
      (block) => block.status === 'active'
    );

    const connectedChannels = channels.filter(
      (channel) => Boolean(channel.ical_import_url)
    );

    const directRevenue = reservations
      .filter((reservation) => reservation.source === 'direct')
      .reduce(
        (total, reservation) => total + Number(reservation.total_price_cents || 0),
        0
      );

    return {
      totalReservations: reservations.length,
      activeReservations: activeReservations.length,
      activeManualBlocks: activeManualBlocks.length,
      connectedChannels: connectedChannels.length,
      directRevenue,
    };
  }, [channels, manualBlocks, reservations]);

  async function handleCreateManualBlock(event) {
    event.preventDefault();
    setError('');
    setNotice('');

    try {
      await createManualBlock(manualForm);

      setManualForm({
        startDate: '',
        endDate: '',
        reason: '',
      });

      setNotice('Manual block created.');
      await loadDashboard();
    } catch (createError) {
      setError(createError.message);
    }
  }

  async function handleCancelManualBlock(id) {
    setError('');
    setNotice('');

    try {
      await cancelManualBlock(id);
      setNotice('Manual block cancelled.');
      await loadDashboard();
    } catch (cancelError) {
      setError(cancelError.message);
    }
  }

  async function handleSyncChannel(channelName) {
    setError('');
    setNotice('');
    setSyncingChannel(channelName);

    try {
      await syncChannel(channelName);
      setNotice(`${sourceLabel(channelName)} sync completed.`);
      await loadDashboard();
    } catch (syncError) {
      setError(syncError.message);
    } finally {
      setSyncingChannel('');
    }
  }

  function jumpTo(sectionId) {
    setActiveSection(sectionId);

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  return (
    <div className="admin-dashboard" style={themeStyle}>
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__mark">O+O</span>
          <div>
            <p>One Plus One</p>
            <span>Luxe Admin</span>
          </div>
        </div>

        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`admin-sidebar__link ${
                activeSection === item.id ? 'is-active' : ''
              }`}
              type="button"
              onClick={() => jumpTo(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar__foot">
          <span>Property</span>
          <p>{property?.public_location || 'Sakumono / Tema, Accra'}</p>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-kicker">Channel manager</p>
            <h1>Dashboard</h1>
            <span>
              Manage reservations, calendar sync, and owner blocks from one place.
            </span>
          </div>

          <div className="admin-topbar__actions">
            {currentUser?.email ? (
              <span className="admin-current-user">{currentUser.email}</span>
            ) : null}

            <button className="admin-refresh" type="button" onClick={loadDashboard}>
              Refresh
            </button>

            <button className="admin-signout" type="button" onClick={onSignOut}>
              Sign out
            </button>
          </div>
        </header>

        {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}
        {notice ? <div className="admin-alert admin-alert--success">{notice}</div> : null}

        <section id="overview" className="admin-section">
          <div className="admin-stat-grid">
            <article className="admin-stat-card admin-stat-card--copper">
              <span className="admin-stat-card__label">Total reservations</span>
              <strong>{loading ? '—' : stats.totalReservations}</strong>
              <p>{stats.activeReservations} active or pending</p>
            </article>

            <article className="admin-stat-card admin-stat-card--green">
              <span className="admin-stat-card__label">Direct revenue</span>
              <strong>{formatMoney(stats.directRevenue)}</strong>
              <p>From direct website holds</p>
            </article>

            <article className="admin-stat-card admin-stat-card--orange">
              <span className="admin-stat-card__label">Manual blocks</span>
              <strong>{loading ? '—' : stats.activeManualBlocks}</strong>
              <p>Owner stays or maintenance</p>
            </article>

            <article className="admin-stat-card admin-stat-card--red">
              <span className="admin-stat-card__label">Connected channels</span>
              <strong>{loading ? '—' : stats.connectedChannels}</strong>
              <p>Airbnb, Vrbo, Booking.com</p>
            </article>
          </div>
        </section>

        <section id="reservations" className="admin-panel admin-section">
          <div className="admin-panel__header">
            <div>
              <h2>Reservations</h2>
              <span>{reservations.length} total records</span>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Stay dates</th>
                  <th>Source</th>
                  <th>Guests</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan="6">No reservations yet.</td>
                  </tr>
                ) : (
                  reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>
                        <p>{reservation.guest_name || 'Guest'}</p>
                        <span>{reservation.guest_email || reservation.guest_phone || 'No contact saved'}</span>
                      </td>
                      <td>
                        <p>{formatDate(reservation.check_in)}</p>
                        <span>to {formatDate(reservation.check_out)}</span>
                      </td>
                      <td>{sourceLabel(reservation.source)}</td>
                      <td>{reservation.guest_count || '—'}</td>
                      <td>{formatMoney(reservation.total_price_cents)}</td>
                      <td>
                        <span
                          className={`admin-status admin-status--${getStatusClass(
                            reservation.status
                          )}`}
                        >
                          {reservation.status || 'unknown'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section id="channels" className="admin-panel admin-section">
          <div className="admin-panel__header">
            <div>
              <h2>Channel connections</h2>
              <span>Sync Booking.com, Airbnb, Vrbo, and direct website dates.</span>
            </div>
          </div>

          <div className="admin-channel-grid">
            {channels.map((channel) => (
              <article className="admin-channel-card" key={channel.id || channel.channel_name}>
                <div>
                  <h3>{sourceLabel(channel.channel_name)}</h3>
                  <span
                    className={`admin-status admin-status--${getStatusClass(
                      channel.last_sync_status || channel.status
                    )}`}
                  >
                    {channel.last_sync_status || channel.status || 'not synced'}
                  </span>
                </div>

                <p>
                  Import URL:{' '}
                  <strong>{channel.ical_import_url ? 'Saved' : 'Not added yet'}</strong>
                </p>

                  {channel.ical_export_token ? (
                    <p className="admin-channel-card__meta admin-channel-card__meta--url">
                      Export URL:{' '}
                      <a
                        href={`${import.meta.env.VITE_API_BASE_URL || ''}/api/ical/${channel.ical_export_token}.ics`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {`${import.meta.env.VITE_API_BASE_URL || ''}/api/ical/${channel.ical_export_token}.ics`}
                      </a>
                    </p>
                  ) : (
                    <p className="admin-channel-card__meta">
                      Export URL: <span>Not generated yet</span>
                    </p>
                  )}

                <p>
                  Last synced:{' '}
                  <strong>{formatDateTime(channel.last_synced_at)}</strong>
                </p>

                {channel.last_sync_error ? (
                  <small>{channel.last_sync_error}</small>
                ) : null}

                {channel.channel_name !== 'direct' ? (
                  <button
                    className="admin-small-button"
                    type="button"
                    disabled={syncingChannel === channel.channel_name}
                    onClick={() => handleSyncChannel(channel.channel_name)}
                  >
                    {syncingChannel === channel.channel_name
                      ? 'Syncing...'
                      : 'Sync now'}
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section id="manual-blocks" className="admin-panel admin-section">
          <div className="admin-panel__header">
            <div>
              <h2>Manual blocks</h2>
              <span>Block dates for owner stays, cleaning, repairs, or maintenance.</span>
            </div>
          </div>

          <form className="admin-block-form" onSubmit={handleCreateManualBlock}>
            <label>
              Start date
              <input
                required
                type="date"
                value={manualForm.startDate}
                onChange={(event) =>
                  setManualForm((current) => ({
                    ...current,
                    startDate: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              End date
              <input
                required
                type="date"
                value={manualForm.endDate}
                onChange={(event) =>
                  setManualForm((current) => ({
                    ...current,
                    endDate: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Reason
              <input
                required
                type="text"
                placeholder="Owner stay, maintenance, deep clean..."
                value={manualForm.reason}
                onChange={(event) =>
                  setManualForm((current) => ({
                    ...current,
                    reason: event.target.value,
                  }))
                }
              />
            </label>

            <button type="submit">Create block</button>
          </form>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Dates</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {manualBlocks.length === 0 ? (
                  <tr>
                    <td colSpan="4">No manual blocks yet.</td>
                  </tr>
                ) : (
                  manualBlocks.map((block) => (
                    <tr key={block.id}>
                      <td>
                        <p>{formatDate(block.start_date)}</p>
                        <span>to {formatDate(block.end_date)}</span>
                      </td>
                      <td>{block.reason || 'Manual admin block'}</td>
                      <td>
                        <span
                          className={`admin-status admin-status--${getStatusClass(
                            block.status
                          )}`}
                        >
                          {block.status}
                        </span>
                      </td>
                      <td>
                        {block.status === 'active' ? (
                          <button
                            className="admin-danger-button"
                            type="button"
                            onClick={() => handleCancelManualBlock(block.id)}
                          >
                            Cancel
                          </button>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
