-- Delivery failures for a lead, as in the reference build's contact_submissions.mail_error.
-- NULL = every alert and the confirmation were accepted by Email Sending.
ALTER TABLE leads ADD COLUMN mail_error TEXT;
