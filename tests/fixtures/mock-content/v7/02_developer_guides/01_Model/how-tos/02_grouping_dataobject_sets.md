---
title: "Grouping DataObject Sets"
summary: "Group and organize collections of DataObjects effectively"
---

# Grouping DataObject Sets

Organize your DataObjects using grouping strategies for better data management and retrieval.

## Using Lists

DataObject sets can be grouped using the list methods:

```php
$products = Product::get()->groupBy('Category');
```

## Creating Custom Groups

You can also create custom grouping logic through custom methods.
