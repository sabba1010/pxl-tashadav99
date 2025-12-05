// src/components/HomeComponents/MY Ads/MyAds.jsx
import React, { useState } from 'react';
import {
  FaInstagram,
  FaSnapchatGhost,
  FaFacebookF,
  FaPlus,
  FaPencilAlt,
  FaTrash,
} from 'react-icons/fa';

const MOCK = [
  {
    id: 1,
    title: 'Aged instagram Account 7 years',
    desc:
      "Aged instagram account with real friends and active follower very sharp good and strong just login with good vpn it doesn't get blocked easily login and enjoy up to 7 years account",
    price: 7,
    status: 'restore',
    platform: 'instagram',
  },
  {
    id: 2,
    title: 'Aged very sharp Snapchat Account strong and active to use 1 years',
    desc: 'Aged very sharp Snapchat Account strong and active to use 1 years With good snapscore',
    price: 6,
    status: 'restore',
    platform: 'snapchat',
  },
  {
    id: 3,
    title: 'Aged instagram Account 7 years',
    desc:
      "Aged instagram account with real friends and active follower very sharp good and strong just login with good vpn it doesn't get blocked easily login and enjoy up to 7 years account",
    price: 9,
    status: 'restore',
    platform: 'instagram',
  },
  {
    id: 4,
    title: 'Aged Facebook dating account already activated',
    desc:
      'Activated Facebook dating account very strong and active and get many matches With real friends login and enjoy very good and reliable use a paid vpn to login and enjoy',
    price: 30,
    status: 'denied',
    platform: 'facebook',
  },
];

const tabs = ['All', 'Active', 'Pending', 'Denied', 'Restore'];

function PlatformIcon({ p }) {
  const size = 36;
  if (p === 'instagram') return <FaInstagram size={size} style={{ color: '#E1306C' }} />;
  if (p === 'snapchat') return <FaSnapchatGhost size={size} style={{ color: '#FFFC00' }} />;
  if (p === 'facebook') return <FaFacebookF size={size} style={{ color: '#1877F2' }} />;
  return <div style={{ width: size, height: size, borderRadius: 8, background: '#eee' }} />;
}

const MyAds = () => {
  const [activeTab, setActiveTab] = useState('Restore');
  const [items, setItems] = useState(MOCK);

  const filtered = items.filter((i) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return i.status === 'active';
    if (activeTab === 'Pending') return i.status === 'pending';
    if (activeTab === 'Denied') return i.status === 'denied';
    if (activeTab === 'Restore') return i.status === 'restore';
    return true;
  });

  const handleRestore = (id) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: 'active' } : it)));
    // You can replace alert with toast/notification in your app
    alert('Ad restored');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this ad?')) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F3EFEE', padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 28, color: '#0A1A3A', margin: 0 }}>My Ads</h1>
            <p style={{ margin: 0, color: '#6B7280' }}>All of your product ads shows here</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 999,
                  background: '#FFECE6',
                  padding: 3,
                  display: 'flex',
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: 999, background: '#FF6B2D', marginLeft: 'auto' }}></div>
              </div>
              <div style={{ color: '#6B7280' }}>Turn Ads Off</div>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 3px 12px rgba(10,26,58,0.04)' }}>
          {/* Tabs */}
          <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: 14, marginBottom: 14 }}>
            <nav style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    paddingBottom: 8,
                    fontSize: 14,
                    color: activeTab === t ? '#FF6B2D' : '#6B7280',
                    borderBottom: activeTab === t ? '2px solid #FF6B2D' : '2px solid transparent',
                  }}
                >
                  {t}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div style={{ maxHeight: '62vh', overflow: 'auto', paddingRight: 8 }}>
            {filtered.length === 0 ? (
              <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', color: '#6B7280' }}>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#FFF3EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>🔊</div>
                </div>
                <h3 style={{ fontSize: 22, color: '#0A1A3A', margin: 0 }}>No Ads</h3>
                <p style={{ marginTop: 8 }}>Add products for customers to buy from you</p>
                <button style={{ marginTop: 18, padding: '10px 18px', borderRadius: 8, background: '#FF6B2D', color: '#fff', border: 'none', cursor: 'pointer' }}>Start selling</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: 18,
                      padding: 16,
                      borderRadius: 10,
                      background: item.status === 'denied' ? '#F4F7FA' : '#fff',
                      alignItems: 'flex-start',
                      border: '1px solid rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{ flexShrink: 0 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', boxShadow: '0 2px 6px rgba(10,26,58,0.04)' }}>
                        <PlatformIcon p={item.platform} />
                      </div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, color: '#0A1A3A' }}>{item.title}</h4>
                          <p style={{ marginTop: 6, color: '#6B7280', fontSize: 14 }}>{item.desc}</p>

                          {item.status === 'denied' && (
                            <div style={{ marginTop: 12, padding: 14, borderRadius: 8, background: '#fff4db', color: '#926B00' }}>
                              <strong>⚠️ Reason for denied</strong>
                              <div style={{ marginTop: 8, fontSize: 13, color: '#6B4F00' }}>
                                Kindly send a screen record of the ads account logged in on your mobile device to our official Telegram number (+2347073823800), thank you.
                              </div>
                            </div>
                          )}
                        </div>

                        <div style={{ width: 160, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                          <div style={{ fontSize: 18, fontWeight: 700, color: '#0A1A3A' }}>${item.price}</div>

                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            {item.status === 'restore' && (
                              <button
                                onClick={() => handleRestore(item.id)}
                                style={{
                                  background: '#FF6B2D',
                                  color: '#fff',
                                  padding: '8px 12px',
                                  borderRadius: 8,
                                  border: 'none',
                                  cursor: 'pointer',
                                }}
                              >
                                Restore
                              </button>
                            )}

                            <button title="Edit" style={{ width: 36, height: 36, borderRadius: 18, border: 'none', background: '#fff', boxShadow: '0 2px 6px rgba(10,26,58,0.04)', cursor: 'pointer' }}>
                              <FaPencilAlt />
                            </button>
                            <button
                              title="Delete"
                              onClick={() => handleDelete(item.id)}
                              style={{ width: 36, height: 36, borderRadius: 18, border: 'none', background: '#fff', boxShadow: '0 2px 6px rgba(10,26,58,0.04)', cursor: 'pointer' }}
                            >
                              <FaTrash />
                            </button>
                          </div>

                          <div>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '6px 10px',
                                borderRadius: 18,
                                background: item.status === 'approved' ? '#EEF7FF' : item.status === 'denied' ? '#fff1f2' : '#F3F4F6',
                                color: item.status === 'approved' ? '#2B6CB0' : item.status === 'denied' ? '#9E2A2B' : '#6B7280',
                                fontSize: 12,
                              }}
                            >
                              {item.status === 'approved' ? 'Approved' : item.status === 'denied' ? 'Denied' : item.status === 'restore' ? 'Restore' : item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        style={{
          position: 'fixed',
          right: 32,
          bottom: 32,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#FF6B2D',
          color: '#fff',
          border: 'none',
          boxShadow: '0 6px 18px rgba(10,26,58,0.12)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default MyAds;
