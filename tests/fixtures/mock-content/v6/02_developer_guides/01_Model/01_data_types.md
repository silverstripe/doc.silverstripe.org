---
title: "Data Types"
summary: "Database data types in Silverstripe"
order: 1
---

# Data Types

Silverstripe supports various data types for database columns.

## Available Types

- Text, Varchar
- Int, BigInt
- Decimal, Float
- Date, Datetime, Time
- Boolean
- Enum

## Example

```php
private static $db = [
    'Name' => 'Varchar(255)',
    'Email' => 'Varchar(255)',
    'Active' => 'Boolean',
    'Created' => 'Datetime',
];
```
