---
title: "API Links and Code Examples"
summary: "Comprehensive testing of API documentation links and code fences"
---

# API Links and Code Examples

This page contains comprehensive examples of API documentation links and code samples for testing.

## Class Links

The [api:SilverStripe\ORM\DataObject] class is the base for all data objects.

Use [api:SilverStripe\ORM\DataList] for querying data.

The [api:SilverStripe\Forms\Form] class handles form rendering and processing.

## Method Links

To filter results, use [api:SilverStripe\ORM\DataList::filter()]:

```php
$results = DataList::create()->filter(['Field' => 'value']);
```

You can also use [api:SilverStripe\ORM\DataList::where()] for custom SQL queries:

```php
$results = DataList::create()->where('Column > ?', [10]);
```

## Property Links

Configure strict hierarchy with [api:SilverStripe\CMS\Model\SiteTree->enforce_strict_hierarchy]:

```php
private static $enforce_strict_hierarchy = true;
```

## Interface Links

Implement [api:SilverStripe\ORM\Filterable] to create custom filterable objects.

## Complex Namespace Examples

Use [api:SilverStripe\StaticPublishQueue\Job\GenerateStaticCacheJob] for publishing cache files.

The [api:SilverStripe\StaticPublishQueue\Contract\StaticallyPublishable] interface is key.

## Code Samples - PHP

### Basic Class Example

```php
<?php

namespace App;

use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\DataList;

class Article extends DataObject
{
    private static $db = [
        'Title' => 'Varchar(255)',
        'Content' => 'Text',
        'Published' => 'Boolean',
    ];

    public function publishedArticles(): DataList
    {
        return Article::get()->filter(['Published' => true]);
    }
}
?>
```

### Querying Data

```php
$articles = Article::get()->filter(['Published' => true])->sort('Created DESC')->limit(10);

foreach ($articles as $article) {
    echo $article->Title;
}
```

### Relations Example

```php
$page = Page::get()->first();
$children = $page->Children();
$allPages = $children->count();
```

## Code Samples - YAML

Configuration example:

```yaml
SilverStripe\Core\Manifest\Module:
  requires:
    silverstripe/framework: ^5.0
    silverstripe/cms: ^5.0
    silverstripe/admin: ^2.0
```

TinyMCE configuration:

```yaml
SilverStripe\TinyMCE\TinyMCEConfig:
  editor_css:
    - 'app/css/editor.css'
  plugins:
    - link
    - image
    - paste
```

## Code Samples - YAML GraphQL

GraphQL schema configuration:

```yaml
SilverStripe\GraphQL\Schema\Schema:
  models:
    Page:
      fields:
        title: String
        content: String
      operations:
        read: true
        create: false
```

## Combined Examples

To use [api:SilverStripe\ORM\DataObject::create()] with custom initialization:

```php
$obj = DataObject::create();
$obj->Title = 'My Title';
$obj->write();
```

Configure [api:SilverStripe\Forms\Form->submitButtonText] in your form:

```php
$form = Form::create($this, 'MyForm', $fields, $actions);
$form->submitButtonText = 'Send Now';
```

## Static Methods

Call [api:SilverStripe\ORM\DataObject::get()] to retrieve a list:

```php
$all = DataObject::get();
$filtered = DataObject::get()->filter(['Active' => true]);
```

## Magic Methods

Some classes support magic methods like [api:SilverStripe\ORM\DataObject::__call()]:

```php
$page = Page::create();
$page->MyCustomField = 'value';
```

## Edge Cases

Underscored properties like [api:SilverStripe\Core\Config\Config->_config_stack]:

```php
// Implementation details
$config = Config::inst();
```

Multiple parameters in methods like [api:SilverStripe\ORM\DataList::filter($name, $value)]:

```php
$items = DataList::create()
    ->filter('Status', 'Active')
    ->filter('Archived', false);
```
