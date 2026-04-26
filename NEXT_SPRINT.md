# Next sprint backlog (product + engineering)

## Messaging care → Physician WhatsApp bridge (idea)
- **Goal**: user messages stay in Seren, but physicians get real-time WhatsApp notifications (and optionally can reply back into Seren).
- **V1 (recommended)**: WhatsApp notification to physician + deep link to open the Seren thread.
  - Message example: “New Seren message from {userName}. Open thread: {link}”
  - Physician replies in Seren (keeps photos/medical context inside the platform).
- **V2 (later)**: two-way sync via WhatsApp Business Platform (API)
  - Outbound: Seren → WhatsApp Business API → physician
  - Inbound: physician reply → WhatsApp webhook → Seren thread (appears as CLINICIAN “Dr. Riris”)
- **Notes/constraints**:
  - Avoid “personal WhatsApp” coupling; use business account/number + audit trail.
  - Prefer keeping photos/medical details in Seren.

