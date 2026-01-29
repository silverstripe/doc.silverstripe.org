---
title: "Relations"
summary: "Managing relationships between data objects"
---

# Relations

Relations allow you to connect [api:SilverStripe\ORM\DataObject] instances together. Use [api:SilverStripe\ORM\DataList] for querying relations.

## Types of Relations

### Has-Many

One object has many related objects using [api:SilverStripe\ORM\Relation::getHasMany()].

```php
private static $has_many = [
    'Children' => 'MyChildClass',
];
```

Accessing has-many relations:

```php
$parent = Page::get()->first();
$children = $parent->Children();
```

### Many-Many

Multiple objects relate to multiple other objects. See [api:SilverStripe\ORM\ManyManyList] for querying.

```php
private static $many_many = [
    'Members' => 'Member',
];
```

Query many-many relations:

```php
$group = Group::get()->first();
$members = $group->Members();
```

### Belongs-To

Reverse of has-many relationship. Set [api:SilverStripe\ORM\DataObject->has_one] to configure.

```php
private static $belongs_to = [
    'Parent' => 'ParentClass',
];
```

Example usage:

```php
$child = MyChildClass::get()->first();
$parent = $child->Parent();
```

## Filtering Relations

You can filter relations using [api:SilverStripe\ORM\DataList::filter()]:

```php
$members = $group->Members()->filter(['Email' => 'test@example.com']);
```

Or use [api:SilverStripe\ORM\DataList::where()] for custom SQL:

```php
$members = $group->Members()->where('Email LIKE ?', '%@example.com');
```
