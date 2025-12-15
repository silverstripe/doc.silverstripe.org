---
title: "Data Types"
summary: "Database data types in Silverstripe"
---

# Data Types

Silverstripe supports various data types for database columns. See [api:SilverStripe\ORM\DataObject] for the base class and [api:SilverStripe\ORM\FieldType\DBField] for field types.

![Data type model](./_datatype-model.svg)

## Available Types

- Text, Varchar
- Int, BigInt
- Decimal, Float
- Date, Datetime, Time
- Boolean
- Enum

For more information on working with lists, see [api:SilverStripe\ORM\DataList] and [api:SilverStripe\ORM\DataList::filter()].

## Example

```php
private static $db = [
    'Name' => 'Varchar(255)',
    'Email' => 'Varchar(255)',
    'Active' => 'Boolean',
    'Created' => 'Datetime',
];
```

## Accessing Properties

You can access properties on data objects like this:

```php
$obj = DataObject::create();
$obj->Name = 'John';
$obj->Email = 'john@example.com';
$obj->write();
```

## Configuration

See [api:SilverStripe\ORM\DataObject->config] for configuration options and [api:SilverStripe\ORM\DataObject::get()] for querying.
