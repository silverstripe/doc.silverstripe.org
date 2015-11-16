<!DOCTYPE html>

<html>
	<% include DocumentationHead %>	
	
	<div id="masthead" <% if Versions %>class="has_versions"<% end_if %>>
		<div class="wrapper">
			<% if Breadcrumbs.count > 1 %>			
				<% include DocumentationBreadcrumbs %>
			<% else_if Page.Title %>
				<h1>$Page.Title</h1>
			<% end_if %>
			<% if Page.Introduction %>
				<div class="introduction">
					<p>$Page.Introduction</p>
				</div>
			<% end_if %>

			<% include DocumentationVersions %>
		</div>
	</div>	
	
	<div class="wrapper">
		<div id="layout" class="clearfix">

			<% include DocumentationSidebar %>

			<div id="content">
				$Layout
				
				<% include DocumentationFooter %>
			</div>
		</div>
	</div>
	

	<%-- New tracking code, added to fix tracking across all domains (which was a problem for Platform section) --%>
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	<%-- Linker is used to track people across the domains, Single-origin Policy prevents cookie-based tracking --%>
	ga('create', 'UA-84547-17', 'auto', {'allowLinker': true});
	ga('require', 'linker');
	ga('linker:autoLink', [
		'silverstripe.com',
		'silverstripe.org',
		'addons.silverstripe.org',
		'api.silverstripe.org',
		'doc.silverstripe.org',
		'userhelp.silverstripe.org',
		'demo.silverstripe.org'
	]);
	ga('send', 'pageview')

	<% include DocumentationEnd %>
</html>
