<!DOCTYPE html> 

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<% base_tag %>
		<title>$Title &raquo; $SiteConfig.Title</title>
		$MetaTags(false)
		
		<link rel="shortcut icon" href="favicon.ico">
		
		<% require javascript(sapphire/thirdparty/jquery/jquery.js) %>
		<% require javascript(http://silverstripe.org/toolbar/javascript/toolbar.js?site=doc&searchShow=false) %>
		<% require css(http://silverstripe.org/toolbar/css/toolbar.css) %>
		
		<% require css(themes/ssorgsites/css/ss.screen.min.css, screen) %>
		<% require css(themes/ssorgsites/css/ss.print.min.css, print) %>
	</head>
<body>
	<div id="header">
		<div id="logo">
			<h1><a href="home/">$SiteConfig.Title</a></h1>
	   		<p>$SiteConfig.Tagline</p>
		</div>
		
		<div id="search-form">
			$SearchForm
		</div>
	</div>
		
	<div id="navigation">
		<ul>
			<% control Menu(1) %>
				<li class="$LinkingMode"><a href="$Link">$MenuTitle</a></li>
			<% end_control %>
		</ul>
	</div>
	
	<div id="layout" class="typography">
		$Layout
	</div>
	
	<div class="clear"><!-- --></div>
	
	<div id="footer">
		<p class="left"><% _t('COPYRIGHT', 'Copyright') %> &copy; $Now.Year</p>
		
		<p class="right">
			<% if CurrentMember %>
				<% _t('CURRENTLYONLINE', "You're currently logged in as") %> $CurrentMember.Name. <a href="Security/logout"><% _t('LOGOUT', 'Logout') %></a>
			<% else_if RealPage %>
				<% _t('CURRENTLYOFFNLINE', "You're currently not logged in") %>. <a href="Security/login"><% _t('LOGIN', 'Login') %></a>
			<% end_if %>
		</p>
	</div> 
</body>
</html>