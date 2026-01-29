---
title: "Basic Configuration"
summary: "Basic Link Field configuration"
---

# Basic Configuration

## Setting Link Types

```yaml
SilverStripe\LinkField\Models\Link:
  link_type_handlers:
    - SilverStripe\LinkField\Models\EmailLink
    - SilverStripe\LinkField\Models\ExternalLink
    - SilverStripe\LinkField\Models\FileLink
    - SilverStripe\LinkField\Models\PageLink
    - SilverStripe\LinkField\Models\PhoneLink
```

## Limiting Link Types

Configure which link types are allowed for specific fields.
