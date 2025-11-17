---
title: "Advanced Options"
summary: "Advanced Link Field configuration"
order: 2
---

# Advanced Configuration

## Custom Link Classes

Extend Link to create custom link types:

```php
class CustomLink extends Link
{
    private static $table_name = 'CustomLink';
    
    public function getTitle()
    {
        return 'Custom Link';
    }
}
```

## Programmatic Configuration

Configure Link Field in PHP:

```php
$field = LinkField::create('MyLink')
    ->setLinkTypes([
        ExternalLink::class,
        PageLink::class,
    ]);
```
