---
title: "Relations"
summary: "Managing relationships between data objects"
---

# Relations

Relations allow you to connect DataObjects together.

## Types of Relations

### Has-Many

One object has many related objects.

```php
private static $has_many = [
    'Children' => 'MyChildClass',
];
```

### Many-Many

Multiple objects relate to multiple other objects.

```php
private static $many_many = [
    'Members' => 'Member',
];
```

### Belongs-To

Reverse of has-many relationship.

```php
private static $belongs_to = [
    'Parent' => 'ParentClass',
];
```
