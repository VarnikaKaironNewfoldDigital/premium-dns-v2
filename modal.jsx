(function () {
  const { useState, useEffect, useMemo } = React;

  /* ===== Icons ===== */
  const Icon = ({ name, size = 16 }) => {
    const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
    switch (name) {
      case 'shield':return <svg {...p}><path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6l8-3z" /></svg>;
      case 'edit':return <svg {...p}><path d="M14.5 4.5l5 5L8 21H3v-5L14.5 4.5z" /><path d="M13 6l5 5" /></svg>;
      case 'trash':return <svg {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>;
      case 'plus':return <svg {...p}><path d="M12 5v14M5 12h14" /></svg>;
      case 'close':return <svg {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>;
      case 'search':return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="M16 16l5 5" /></svg>;
      case 'check':return <svg {...p}><path d="M5 12l5 5L20 7" /></svg>;
      case 'copy':return <svg {...p}><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2h3" /></svg>;
      case 'info':return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v5h1" /></svg>;
      case 'warn':return <svg {...p}><path d="M12 3l10 18H2L12 3z" /><path d="M12 10v5M12 18h.01" /></svg>;
      case 'key':return <svg {...p}><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M16 7l3 3" /></svg>;
      case 'list':return <svg {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>;
      default:return null;
    }
  };

  const TYPES = ['ALL', 'A', 'AAAA', 'MX', 'CNAME', 'NS', 'TXT', 'SRV', 'SOA'];

  // TTL display + edit options (seconds under the hood)
  const TTL_OPTIONS = [
  { v: 60, label: '1 min' },
  { v: 300, label: '5 mins' },
  { v: 600, label: '10 mins' },
  { v: 1800, label: '30 mins' },
  { v: 3600, label: '1 hour' },
  { v: 7200, label: '2 hours' },
  { v: 14400, label: '4 hours' },
  { v: 21600, label: '6 hours' },
  { v: 43200, label: '12 hours' },
  { v: 86400, label: '1 day' }];

  const formatTTL = (s) => {
    const n = Number(s) || 0;
    if (n < 60) return `${n} sec`;
    if (n < 3600) return `${Math.round(n / 60)} min${Math.round(n / 60) === 1 ? '' : 's'}`;
    if (n < 86400) {
      const h = n / 3600;
      return Number.isInteger(h) ? `${h} hour${h === 1 ? '' : 's'}` : `${h.toFixed(1)} hours`;
    }
    const d = n / 86400;
    return Number.isInteger(d) ? `${d} day${d === 1 ? '' : 's'}` : `${d.toFixed(1)} days`;
  };
  const INITIAL_RECORDS = [
  { id: 1, type: 'A', host: '125050949.dns.webpropanel.com', value: '209.99.17.56', ttl: 3600 },
  { id: 2, type: 'MX', host: 'webpropanel.com', value: 'mx1.titan.email', ttl: 3600, priority: 10 },
  { id: 3, type: 'MX', host: 'webpropanel.com', value: 'mx2.titan.email', ttl: 3600, priority: 20 },
  { id: 4, type: 'NS', host: 'webpropanel.com', value: 'rcwebinar.mars.orderbox-dns.com', ttl: 86400 },
  { id: 5, type: 'NS', host: 'webpropanel.com', value: 'rcwebinar.mars.orderbox-dns.com', ttl: 86400 },
  { id: 6, type: 'NS', host: 'webpropanel.com', value: 'rcwebinar.mercury.orderbox-dns.com', ttl: 86400 },
  { id: 7, type: 'NS', host: 'webpropanel.com', value: 'rcwebinar.mercury.orderbox-dns.com', ttl: 86400 },
  { id: 8, type: 'TXT', host: 'titan1._domainkey.webpropanel.com', value: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ…', ttl: 3600 },
  { id: 9, type: 'TXT', host: 'webpropanel.com', value: 'v=spf1 include:spf.titan.email ~all', ttl: 3600 },
  { id: 10, type: 'SOA', host: 'webpropanel.com', value: 'simrantalreja@gmail.com', ttl: 86400 }];

  const INITIAL_DS = [
  { id: 1, keyTag: '59656', algo: '8 (RSA/SHA-256)', digestType: '2 (SHA-256)', digest: '26B3CC5FE76650A092D6E0FBCF8EED8A9308234FFBA606127F250AC8435CB669', updated: '2026-04-14 08:35 UTC' }];

  const INITIAL_KEYS = [
    { id: 'ksk', kind: 'KSK', label: 'KSK — KEY SIGNING KEY', keyId: '75211792', type: '257', protocol: '3', algo: '8 (RSA/SHA-256)', publicKey: 'AwEAAaE+spxaRDAE6JskXEZLgR3TSNhgMsRZ5zbkxSWnHALDlWS5CaSsThjWDwG5EAZ6ia8Vr9OdjBsHNZO3KyaR5Nb4eJc4SSyNzeFtqBGUD3bajBGs08jWylARbB3Jdc+KFmXEobciaCS+4rlR027BS0363/qLf+cVH0NvayFilTsnt1AkmhrRBHIHjXcNKavEVp7WYhgZuOeDaxNrgDfXG28=' },
    { id: 'zsk', kind: 'ZSK', label: 'ZSK — ZONE SIGNING KEY', keyId: '75211793', type: '256', protocol: '3', algo: '8 (RSA/SHA-256)', publicKey: 'AwEAAbhSr6xZ4/hz3JjGTVSv//IvuKPlMAYbOaTFkHw/jMS020e8OtNv/W0+uc78COCMq3vxmQSeXYO8jz3S4bQf4XjbqWi/l9k866YYm8YucSByqbV4+Xxg9aNrnfM4tZnrjg8hsK3OOLBYZ4NWrlRZtSq5VzzmyCwkDwgvq2ab08Kt' },
  ];


  // Per-type field schema. `host` and `ttl` are always present.
  // Each entry defines the EXTRA fields (besides host + ttl) that show in the form.
  // `kind` controls input type: text | number | select | textarea
  const FIELDS_BY_TYPE = {
    A: {
      hostLabel: 'Domain / Sub-domain',
      fields: [
        { key: 'value', label: 'IPv4 Address', placeholder: 'e.g. 192.0.2.1', kind: 'text', required: true },
      ],
    },
    AAAA: {
      hostLabel: 'Domain / Sub-domain',
      fields: [
        { key: 'value', label: 'IPv6 Address', placeholder: 'e.g. 2001:db8::1', kind: 'text', required: true },
      ],
    },
    MX: {
      hostLabel: 'Domain / Sub-domain',
      fields: [
        { key: 'value', label: 'Mail Server', placeholder: 'e.g. mx1.example.com', kind: 'text', required: true },
        { key: 'priority', label: 'Priority', placeholder: '10', kind: 'number', min: 0, max: 65535, default: 10, hint: 'Lower = preferred' },
      ],
    },
    CNAME: {
      hostLabel: 'Alias (Sub-domain)',
      fields: [
        { key: 'value', label: 'Points To', placeholder: 'e.g. target.example.com', kind: 'text', required: true },
      ],
    },
    NS: {
      hostLabel: 'Domain / Sub-domain',
      fields: [
        { key: 'value', label: 'Name Server', placeholder: 'e.g. ns1.example.com', kind: 'text', required: true },
      ],
    },
    TXT: {
      hostLabel: 'Domain / Sub-domain',
      fields: [
        { key: 'value', label: 'Text Value', placeholder: 'e.g. v=spf1 include:…', kind: 'textarea', required: true, full: true },
      ],
    },
    SRV: {
      hostLabel: 'Name',
      hostPlaceholder: 'e.g. _sip._tcp.example.com',
      fields: [
        { key: 'priority', label: 'Priority', placeholder: '10', kind: 'number', min: 0, max: 65535, default: 10 },
        { key: 'weight',   label: 'Weight',   placeholder: '5',  kind: 'number', min: 0, max: 65535, default: 5 },
        { key: 'port',     label: 'Port',     placeholder: '5060', kind: 'number', min: 1, max: 65535, default: 80 },
        { key: 'value',    label: 'Target',   placeholder: 'e.g. target.example.com', kind: 'text', required: true, full: true },
      ],
    },
    SOA: {
      hostLabel: 'Domain',
      fields: [
        { key: 'value',     label: 'Primary Nameserver', placeholder: 'e.g. ns1.example.com', kind: 'text', required: true },
        { key: 'rname',     label: 'Admin Email',        placeholder: 'admin@example.com',    kind: 'text', required: true },
        { key: 'serial',    label: 'Serial',  kind: 'number', default: 2025010101 },
        { key: 'refresh',   label: 'Refresh', kind: 'number', default: 3600 },
        { key: 'retry',     label: 'Retry',   kind: 'number', default: 600 },
        { key: 'expire',    label: 'Expire',  kind: 'number', default: 604800 },
        { key: 'minimum',   label: 'Minimum TTL', kind: 'number', default: 3600 },
      ],
    },
  };

  function RecordEditRow({ initial, isNew, onSave, onCancel }) {
    const [d, setD] = useState(initial);
    const upd = (k, v) => setD((s) => ({ ...s, [k]: v }));

    // When type changes (only possible while adding), reset to that type's defaults
    const onTypeChange = (newType) => {
      const schema = FIELDS_BY_TYPE[newType];
      const next = { type: newType, host: d.host || '', ttl: d.ttl || 3600 };
      for (const f of schema.fields) next[f.key] = f.default ?? '';
      setD(next);
    };

    const schema = FIELDS_BY_TYPE[d.type] || FIELDS_BY_TYPE.A;
    const valid = String(d.host || '').trim() && schema.fields.every(f => !f.required || String(d[f.key] ?? '').trim());

    const renderField = (f) => {
      const common = {
        value: d[f.key] ?? '',
        onChange: (e) => upd(f.key, f.kind === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value),
        placeholder: f.placeholder || '',
      };
      if (f.kind === 'textarea') return <textarea rows={2} {...common} />;
      if (f.kind === 'number')   return <input type="number" min={f.min} max={f.max} {...common} />;
      return <input type="text" {...common} />;
    };

    return (
      <div className="pdm-trow editing">
        <form className="pdm-edit-card" style={{ gridColumn: '1 / -1' }} onSubmit={(e)=>{e.preventDefault(); valid && onSave(d);}}>
          <div className="pdm-edit-card-head">
            <span className={`pdm-chip ${d.type}`}>{d.type}</span>
            <span className="pdm-edit-card-title">{isNew ? `Add ${d.type} record` : `Edit ${d.type} record`}</span>
            {isNew && (
              <label className="pdm-edit-typesel">
                <span>Type</span>
                <select value={d.type} onChange={(e) => onTypeChange(e.target.value)}>
                  {TYPES.slice(1).map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
            )}
          </div>
          <div className="pdm-edit-grid">
            {/* Host */}
            <label className="pdm-fld">
              <span className="pdm-fld-label">{schema.hostLabel}{(schema.fields[0]?.required) ? '*' : ''}</span>
              <input
                type="text"
                placeholder={schema.hostPlaceholder || schema.hostLabel}
                value={d.host || ''}
                onChange={(e) => upd('host', e.target.value)}
                autoFocus
              />
            </label>
            {/* Type-specific fields */}
            {schema.fields.map((f) => (
              <label key={f.key} className={`pdm-fld ${f.full ? 'full' : ''}`}>
                <span className="pdm-fld-label">{f.label}{f.required ? '*' : ''}</span>
                {renderField(f)}
                {f.hint && <span className="pdm-fld-hint">{f.hint}</span>}
              </label>
            ))}
            {/* TTL — always last */}
            <label className="pdm-fld">
              <span className="pdm-fld-label">TTL</span>
              <select value={d.ttl} onChange={(e) => upd('ttl', parseInt(e.target.value))}>
                {TTL_OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
                {!TTL_OPTIONS.some((o) => o.v === d.ttl) &&
                  <option value={d.ttl}>{formatTTL(d.ttl)} (custom)</option>
                }
              </select>
            </label>
          </div>
          <div className="pdm-edit-card-foot">
            <span className="pdm-edit-note">These changes will take 4–6 hours to come into effect.</span>
            <div className="pdm-save-cancel">
              <button type="button" className="pdm-btn ghost sm" onClick={onCancel}>Cancel</button>
              <button type="submit" className="pdm-btn solid sm" disabled={!valid}>
                <Icon name="check" size={12} /> {isNew ? 'Add Record' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>);

  }

  function DnsRecordsTab({ records, setRecords }) {
    const [search, setSearch] = useState('');
    const [activeType, setActiveType] = useState('ALL');
    const [editingId, setEditingId] = useState(null);
    const [addingType, setAddingType] = useState(null);

    const counts = useMemo(() => {
      const c = { ALL: records.length };
      for (const t of TYPES.slice(1)) c[t] = records.filter((r) => r.type === t).length;
      return c;
    }, [records]);

    const filtered = records.filter((r) => {
      if (activeType !== 'ALL' && r.type !== activeType) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.host.toLowerCase().includes(q) && !String(r.value).toLowerCase().includes(q) && !r.type.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    const handleDelete = (id) => {setRecords(records.filter((r) => r.id !== id));if (editingId === id) setEditingId(null);};
    const handleSave = (id, draft) => {setRecords(records.map((r) => r.id === id ? { ...r, ...draft } : r));setEditingId(null);};
    const handleAdd = (draft) => {
      const newId = Math.max(0, ...records.map((r) => r.id)) + 1;
      setRecords([...records, { id: newId, ...draft }]);setAddingType(null);
    };

    return (
      <div>
        <div className="pdm-callout info">
          <span className="ic"><Icon name="info" size={16} /></span>
          <div><strong>Premium Anycast DNS active.</strong> Edits propagate worldwide in under 60 seconds.</div>
        </div>
        <div className="pdm-toolbar">
          <div className="pdm-search">
            <span className="pdm-sicon"><Icon name="search" size={14} /></span>
            <input placeholder="Search by host, value or type…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="pdm-btn solid" onClick={() => setAddingType(activeType === 'ALL' ? 'A' : activeType)}>
            <Icon name="plus" size={13} /> Add Record
          </button>
        </div>
        <div className="pdm-type-filter">
          {TYPES.map((t) =>
          <button key={t} className={t === activeType ? 'active' : ''} onClick={() => setActiveType(t)}>
              {t}<span className="pdm-count">{counts[t] || 0}</span>
            </button>
          )}
        </div>
        <div className="pdm-table">
          <div className={`pdm-thead ${activeType==='MX'?'mx':''}`}>
            <div>Type</div>
            <div>Host</div>
            <div>Value</div>
            {activeType === 'MX' && <div>Priority</div>}
            <div>TTL</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>
          {addingType &&
          <RecordEditRow initial={(()=>{const s=FIELDS_BY_TYPE[addingType]||FIELDS_BY_TYPE.A; const o={type:addingType, host:'', ttl:3600}; for (const f of s.fields) o[f.key]=f.default ?? ''; return o;})()} isNew onSave={handleAdd} onCancel={() => setAddingType(null)} />
          }
          {filtered.length === 0 && !addingType ?
          <div className="pdm-empty">
              <div className="icon"><Icon name="list" size={18} /></div>
              <div>No {activeType !== 'ALL' ? activeType : ''} records {search ? `match "${search}"` : 'yet'}.</div>
              <div style={{ marginTop: 10 }}>
                <button className="pdm-btn sm" onClick={() => setAddingType(activeType === 'ALL' ? 'A' : activeType)}>
                  <Icon name="plus" size={12} /> Add a record
                </button>
              </div>
            </div> :
          filtered.map((r) =>
          editingId === r.id ?
          <RecordEditRow key={r.id} initial={r} onSave={(d) => handleSave(r.id, d)} onCancel={() => setEditingId(null)} /> :

          <div key={r.id} className={`pdm-trow ${activeType==='MX'?'mx':''}`}>
                <div><span className={`pdm-chip ${r.type}`}>{r.type}</span></div>
                <div className="pdm-host" title={r.host}>{r.host}</div>
                <div className="pdm-value pdm-mono" title={r.value}>
                  {r.type === 'MX' && r.priority != null && activeType !== 'MX' ? <span style={{ color: 'var(--pdm-muted)', marginRight: 8 }}>{r.priority}</span> : null}
                  {r.value}
                </div>
                {activeType === 'MX' && (
                  <div className="pdm-ttl" style={{fontVariantNumeric:'tabular-nums', color:'var(--pdm-ink)'}}>
                    {r.type === 'MX' ? (r.priority ?? '—') : '—'}
                  </div>
                )}
                <div className="pdm-ttl" title={`${r.ttl} seconds`}>{formatTTL(r.ttl)}</div>
                <div className="pdm-actions">
                  <button className="pdm-iconbtn" title="Edit" onClick={() => setEditingId(r.id)}><Icon name="edit" size={14} /></button>
                  <button className="pdm-iconbtn danger" title={r.type === 'SOA' ? 'SOA cannot be deleted' : 'Delete'} disabled={r.type === 'SOA'} onClick={() => r.type !== 'SOA' && handleDelete(r.id)}>
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>

          )}
        </div>
      </div>);

  }

  function DnssecTab({ enabled, setEnabled, dsRecords, setDsRecords, keys }) {
    return (
      <div className="pdm-dnssec">
        {/* Header card: title + subtitle + toggle */}
        <div className="pdm-dnssec-card pdm-dnssec-header">
          <div>
            <div className="pdm-dnssec-title">DNSSEC Signing</div>
            <div className="pdm-dnssec-sub">Cryptographically signs your DNS records to prevent spoofing and cache poisoning</div>
          </div>
          <button
            className={`pdm-toggle-orange ${enabled ? 'on' : ''}`}
            onClick={() => setEnabled(!enabled)}
            aria-label="Toggle DNSSEC"
            role="switch"
            aria-checked={enabled}
          ></button>
        </div>

        {!enabled && (
          <div className="pdm-callout warn" style={{marginTop: 14}}>
            <span className="ic"><Icon name="warn" size={16}/></span>
            <div><strong>DNSSEC is currently off.</strong> Without DNSSEC, resolvers can&rsquo;t cryptographically verify your DNS responses.</div>
          </div>
        )}

        {enabled && (
          <>
            {/* Instructions */}
            <p className="pdm-dnssec-instructions">
              Provide these <strong>Delegation Signing (DS) records</strong> to your domain registrar to complete DNSSEC setup.
              Look for <strong>"DNSSEC"</strong> or <strong>"DS Records"</strong> under your registrar's DNS settings.
            </p>

            {/* DS Record card */}
            {dsRecords.map((r) => (
              <div key={r.id} className="pdm-dnssec-card pdm-dnssec-record">
                <div className="pdm-dnssec-card-head">
                  <span className="pdm-dnssec-card-label">DS RECORD</span>
                  <button className="pdm-iconbtn" title="Copy"><Icon name="copy" size={14}/></button>
                </div>
                <div className="pdm-dnssec-grid two-col">
                  <Field label="Key Tag" value={r.keyTag} />
                  <Field label="Algorithm" value={r.algo} />
                  <Field label="Digest Type" value={r.digestType} />
                  <Field label="Last Updated" value={r.updated} />
                  <Field label="Digest" value={r.digest} full mono />
                </div>
              </div>
            ))}

            {/* DNS Keys section */}
            <div className="pdm-dnssec-section-title">DNS Keys</div>

            {keys.map((k) => (
              <div key={k.id} className="pdm-dnssec-card pdm-dnssec-keycard">
                <div className="pdm-dnssec-card-head">
                  <span className={`pdm-key-badge ${k.kind.toLowerCase()}`}>{k.label}</span>
                  <button className="pdm-iconbtn" title="Copy public key"><Icon name="copy" size={14}/></button>
                </div>
                <div className="pdm-dnssec-grid two-col">
                  <Field label="Key ID" value={k.keyId} />
                  <Field label="Type" value={k.type} />
                  <Field label="Protocol" value={k.protocol} />
                  <Field label="Algorithm" value={k.algo} />
                  <Field label="Public Key" value={k.publicKey} full mono wrap />
                </div>
              </div>
            ))}

            <div style={{marginTop: 18, fontSize: 12, color: 'var(--pdm-muted)'}}>
              Need help? Read the <a href="#" style={{color: 'var(--pdm-blue)'}}>DNSSEC setup guide</a> or <a href="#" style={{color: 'var(--pdm-blue)'}}>contact support</a>.
            </div>
          </>
        )}
      </div>
    );
  }

  function Field({ label, value, full, mono, wrap }) {
    return (
      <div className={`pdm-dnssec-field ${full ? 'full' : ''}`}>
        <div className="pdm-dnssec-field-label">{label}</div>
        <div className={`pdm-dnssec-field-value ${mono ? 'mono' : ''} ${wrap ? 'wrap' : ''}`}>{value}</div>
      </div>
    );
  }

  function PremiumDnsModal({ onClose }) {
    const [tab, setTab] = useState('records');
    const [records, setRecords] = useState(INITIAL_RECORDS);
    const [dnssecEnabled, setDnssecEnabled] = useState(true);
    const [dsRecords, setDsRecords] = useState(INITIAL_DS);

    useEffect(() => {
      const onKey = (e) => {if (e.key === 'Escape') onClose();};
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
      <div className="pdm-backdrop" onClick={onClose}>
        <div className="pdm-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
          <div className="pdm-head">
            <div>
              <h2>Manage Premium DNS</h2>
              <div className="pdm-sub">
                <span>For <strong>webpropanel.com</strong></span>
                <span className="dot"></span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--pdm-green)' }}></span>
                  Anycast network
                </span>
              </div>
            </div>
            <button className="pdm-close" onClick={onClose} aria-label="Close"><Icon name="close" size={16} /></button>
          </div>
          <div className="pdm-tabs" style={{ backgroundColor: "rgb(255, 255, 255)" }}>
            <button className={tab === 'records' ? 'active' : ''} onClick={() => setTab('records')}>
              DNS Records
              <span className="pdm-count">{records.length}</span>
            </button>
            <button className={tab === 'dnssec' ? 'active' : ''} onClick={() => setTab('dnssec')}>
              DNSSEC Settings
              <span className="pdm-count">{dnssecEnabled ? 'On' : 'Off'}</span>
            </button>
          </div>
          <div className="pdm-body">
            {tab === 'records' ?
            <DnsRecordsTab records={records} setRecords={setRecords} /> :
            <DnssecTab enabled={dnssecEnabled} setEnabled={setDnssecEnabled} dsRecords={dsRecords} setDsRecords={setDsRecords} keys={INITIAL_KEYS} />}
          </div>
          <div className="pdm-foot">
            <div className="meta">Last propagated 2 minutes ago</div>
            <div className="actions">
              <button className="pdm-btn ghost" onClick={onClose}>Close</button>
              <button className="pdm-btn solid" onClick={onClose}>Done</button>
            </div>
          </div>
        </div>
      </div>);

  }

  function App() {
    const [open, setOpen] = useState(false);
    useEffect(() => {
      const handler = () => setOpen(true);
      // Bind to all MANAGE buttons in the Premium DNS section, not just our id
      const btn = document.getElementById('open-premium-dns-modal');
      if (btn) btn.addEventListener('click', handler);
      // Also delegate so the original main bundle re-rendering doesn't lose the binding
      const onAnyClick = (e) => {
        const t = e.target.closest('#open-premium-dns-modal');
        if (t) {e.preventDefault();setOpen(true);}
      };
      document.addEventListener('click', onAnyClick, true);
      return () => {
        if (btn) btn.removeEventListener('click', handler);
        document.removeEventListener('click', onAnyClick, true);
      };
    }, []);
    return open ? <PremiumDnsModal onClose={() => setOpen(false)} /> : null;
  }

  const root = ReactDOM.createRoot(document.getElementById('premium-dns-modal-root'));
  root.render(<App />);
})();