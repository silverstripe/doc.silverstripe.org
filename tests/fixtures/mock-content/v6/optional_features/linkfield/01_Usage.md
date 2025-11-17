---
title: "Usage"
summary: "Using the Link Field in your project"
order: 1
---

# Using Link Field

Add link fields to your DataObjects with simple configuration.

## Basic Setup

```php
private static $has_one = [
    'Link' => SilverStripe\LinkField\Models\Link::class,
];

private static $owns = [
    'Link',
];
```

## Frontend Rendering

```php
<% if $Link %>
    <a href="$Link.URL">$Link.Title</a>
<% end_if %>
```
