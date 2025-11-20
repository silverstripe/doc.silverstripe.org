---
title: "Dynamic Default Fields"
summary: "How to set dynamic default field values in DataObjects"
---

# Dynamic Default Fields

Learn how to set dynamic default values for fields when creating new records.

## Setting Defaults

Use the `default_values` configuration option to provide default values for new records.

```php
class Product extends DataObject
{
    private static $db = [
        'Name' => 'Varchar',
        'Created' => 'Date',
    ];
    
    private static $defaults = [
        'Created' => 'now'
    ];
}
```
