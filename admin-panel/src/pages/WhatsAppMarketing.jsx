import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import "../assets/whatsappMarketing.css";

const defaultTemplate = `Hi {name},\n\nWe have a special offer for you this week. Reply YES and we'll share details.`;

const normalizePhone = (rawPhone = "") => rawPhone.replace(/\D/g, "");

const parseManualContacts = (input) => {
  if (!input.trim()) return [];

  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [namePart, phonePart] = line.split(",").map((part) => part?.trim() || "");
      const phone = normalizePhone(phonePart || namePart);
      const name = phonePart ? namePart : `Contact ${index + 1}`;

      return {
        id: `manual-${index}-${phone}`,
        name,
        phone,
        source: "manual",
      };
    })
    .filter((contact) => contact.phone.length >= 10);
};

function WhatsAppMarketing() {
  const [businessNumber, setBusinessNumber] = useState("91");
  const [template, setTemplate] = useState(defaultTemplate);
  const [source, setSource] = useState("leads");
  const [manualInput, setManualInput] = useState("");
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const res = await api.get("/leads");
        const formatted = res.data
          .filter((lead) => lead.phone)
          .map((lead) => ({
            id: lead.id,
            name: lead.name || "Customer",
            phone: normalizePhone(lead.phone),
            source: "lead",
          }))
          .filter((lead) => lead.phone.length >= 10);

        setLeads(formatted);
      } catch {
        alert("Could not load leads for WhatsApp campaign");
      } finally {
        setLoadingLeads(false);
      }
    };

    loadLeads();
  }, []);

  const contacts = useMemo(() => {
    const baseContacts = source === "manual" ? parseManualContacts(manualInput) : leads;

    if (!search.trim()) return baseContacts;

    const term = search.toLowerCase();
    return baseContacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(term) ||
        contact.phone.toLowerCase().includes(term)
    );
  }, [source, manualInput, leads, search]);

  const campaignRows = useMemo(() => {
    const sender = normalizePhone(businessNumber);

    return contacts.map((contact) => {
      const personalizedMessage = template.replaceAll("{name}", contact.name);
      const encodedMessage = encodeURIComponent(personalizedMessage);

      return {
        ...contact,
        personalizedMessage,
        whatsappLink: `https://wa.me/${sender}?text=${encodedMessage}`,
      };
    });
  }, [contacts, businessNumber, template]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    } catch {
      alert("Clipboard permission denied");
    }
  };

  return (
    <div className="wa-page">
      <div className="wa-header">
        <h2>WhatsApp Marketing Tool</h2>
        <p>Create personalized campaign messages and open chats quickly.</p>
      </div>

      <div className="wa-grid">
        <section className="wa-card">
          <h3>Campaign Setup</h3>

          <label>Business WhatsApp number (country code included)</label>
          <input
            value={businessNumber}
            onChange={(e) => setBusinessNumber(e.target.value)}
            placeholder="e.g. 919876543210"
          />

          <label>Audience source</label>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="leads">Use website leads</option>
            <option value="manual">Paste manual contacts</option>
          </select>

          {source === "manual" && (
            <>
              <label>Manual contacts (one per line: Name,Phone or only Phone)</label>
              <textarea
                rows={7}
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder={"Rahul,9876543210\nPriya,9123456780\n919999888877"}
              />
            </>
          )}

          <label>Message template (use {'{name}'} for personalization)</label>
          <textarea
            rows={7}
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          />

          <div className="wa-stats">
            <span>Contacts in campaign: {campaignRows.length}</span>
            <span>
              Source status: {source === "leads" && loadingLeads ? "Loading leads..." : "Ready"}
            </span>
          </div>
        </section>

        <section className="wa-card">
          <h3>Preview & Send</h3>

          <input
            className="wa-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contact by name or phone"
          />

          <div className="wa-list">
            {campaignRows.length === 0 ? (
              <p className="wa-empty">No valid contacts found for this campaign.</p>
            ) : (
              campaignRows.map((row) => (
                <article className="wa-item" key={row.id}>
                  <div>
                    <strong>{row.name}</strong>
                    <p>{row.phone}</p>
                  </div>

                  <p className="wa-message">{row.personalizedMessage}</p>

                  <div className="wa-actions">
                    <button onClick={() => copyToClipboard(row.personalizedMessage)}>
                      Copy Message
                    </button>
                    <a href={row.whatsappLink} target="_blank" rel="noreferrer">
                      Open WhatsApp
                    </a>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default WhatsAppMarketing;
