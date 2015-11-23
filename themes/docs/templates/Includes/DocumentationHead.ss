<head>
	<% base_tag %>
	<meta charset="utf-8" />
	<title><% if Title %>$Title &#8211; <% end_if %>SilverStripe Documentation</title>

	<link rel="apple-touch-icon" sizes="57x57" href="$ThemeDir/favicons/apple-touch-icon-57x57.png">
	<link rel="apple-touch-icon" sizes="60x60" href="$ThemeDir/favicons/apple-touch-icon-60x60.png">
	<link rel="apple-touch-icon" sizes="72x72" href="$ThemeDir/favicons/apple-touch-icon-72x72.png">
	<link rel="apple-touch-icon" sizes="76x76" href="$ThemeDir/favicons/apple-touch-icon-76x76.png">
	<link rel="apple-touch-icon" sizes="114x114" href="$ThemeDir/favicons/apple-touch-icon-114x114.png">
	<link rel="apple-touch-icon" sizes="120x120" href="$ThemeDir/favicons/apple-touch-icon-120x120.png">
	<link rel="apple-touch-icon" sizes="144x144" href="$ThemeDir/favicons/apple-touch-icon-144x144.png">
	<link rel="apple-touch-icon" sizes="152x152" href="$ThemeDir/favicons/apple-touch-icon-152x152.png">
	<link rel="apple-touch-icon" sizes="180x180" href="$ThemeDir/favicons/apple-touch-icon-180x180.png">
	<link rel="icon" type="image/png" href="$ThemeDir/favicons/favicon-32x32.png" sizes="32x32">
	<link rel="icon" type="image/png" href="$ThemeDir/favicons/favicon-194x194.png" sizes="194x194">
	<link rel="icon" type="image/png" href="$ThemeDir/favicons/favicon-96x96.png" sizes="96x96">
	<link rel="icon" type="image/png" href="$ThemeDir/favicons/android-chrome-192x192.png" sizes="192x192">
	<link rel="icon" type="image/png" href="$ThemeDir/favicons/favicon-16x16.png" sizes="16x16">
	<link rel="manifest" href="$ThemeDir/favicons/manifest.json"> <%-- Controls which icon to use for Android Chrome --%>
	<link rel="mask-icon" href="$ThemeDir/favicons/safari-pinned-tab.svg" color="#5bbad5">
	<meta name="msapplication-TileColor" content="#005b94">
	<meta name="msapplication-TileImage" content="$ThemeDir/favicons/mstile-144x144.png">
	<meta name="theme-color" content="#1b354c">

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
			$GlobalNav('doc')
			<% include SearchBox %>
		</div>
	</div>
</header>
