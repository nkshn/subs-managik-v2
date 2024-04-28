TODO for backend:

[x] test all routing
[x] create test data for services
[x] connect to s3 and upload all images
[x] create seed and migrations
[x] add admin guard ??
[x] add buisnes logic under managing subs
[x] add google auth0 authentication
[x] add twillio for validation user phone number (maybe make seperate table wuth: )
  - user_phone table:
    - id
    - user_id
    - phone
    - is_verified
    - verification_code
  - sms_notification
    - id
    - user_id
    - title
    - message
    - status
    - created_at
    - delivered_at
[x] add twillio for sending sms for valid user phone number
