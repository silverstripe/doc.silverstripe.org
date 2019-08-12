<head>
	<% base_tag %>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><% if Title %>$Title &#8211; <% end_if %>SilverStripe Documentation</title>

	<% include DocumentationFavicons %>

	<% if $CanonicalUrl %>
		<link rel="canonical" href="$CanonicalUrl" />
	<% end_if %>

	<%--Set default priority search results--%>
	<meta class="swiftype" name="site-priority" data-type="integer" content="1" />
	<meta class="swiftype" name="title" data-type="string" content="$Title">

	<link rel="stylesheet" href="$ThemeDir/css/ionicons.min.css" />
	<link rel="stylesheet" href="$ThemeDir/css/styles.css" />
	<script type="text/javascript" src="//use.typekit.net/emt4dhq.js"></script>
	<script type="text/javascript">try{Typekit.load();}catch(e){}</script>
	<script>window.GLOBAL_NAV_SECONDARY_ID = 1560;</script>
</head>

<body class="theme-theme1">

<header class="site-header" data-0="background-position: 50% 50%;" data-544="background-position: 50% -30%;">
	<div class="global-nav header-mask">
		<div id="navWrapper">
			<div class="nav-mobile">
				$GlobalNav('doc')
			</div>
		</div>
	</div>
</header>
<% include SearchModal %>
