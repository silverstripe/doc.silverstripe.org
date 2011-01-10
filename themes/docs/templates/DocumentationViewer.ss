<!DOCTYPE html>

<html>
	<head>
		<% base_tag %>
		<meta charset="utf-8" />
		<title><% if Title %>$Title<% end_if %> SilverStripe Documentation</title>
		
		<% require javascript(sapphire/thirdparty/jquery/jquery.js) %>
		<% require javascript(toolbar/javascript/toolbar.js?site=doc&searchShow=false) %>
		<% require css(toolbar/css/toolbar.css) %>
		
		<% require css(themes/ssorgsites/css/ss.screen.min.css, screen) %>
		<% require css(themes/ssorgsites/css/ss.print.min.css, print) %>
		
		<% require themedCSS(DocumentationViewer) %>
	</head>
	
	<body>
		<div id="container">
			<div id="header">
				<h1><a href="$Link"><% _t('SILVERSTRIPEDOCUMENTATION', 'SilverStripe Documentation') %></a></h1>
				
				<div id="language">
				 	$LanguageForm
				</div>
				
				<div id="breadcrumbs">
					<% include DocBreadcrumbs %>
				</div>	
				
				<div id="search">
					$DocumentationSearchForm
				</div>
			</div>
			
			<div id="layout">
				<div id="versions-nav">
					<h2>Versions:</h2>
					
					<ul>
						<% control Versions %>
							<% if MajorRelease %>
								<li class="major-release"><a href="$Link" class="$LinkingMode">$Title</a></li>
							<% else %>
								<li class="module-only"><a href="$Link" class="$LinkingMode">$Title</a></li>
							<% end_if %>
						<% end_control %>
					</ul>
				</div>
				
				<div id="content" class="typography">
					$Layout
				</div>
				
				<div id="comments">
					<p class="notice">
						<strong>Comment policy:</strong> Please use comments for <strong>tips and corrections</strong> about the described 
				functionality. <br />
				Comments are moderated, we reserve the right to remove comments that are inappropriate or are no longer relevant. Use the <strong><a href="http://silverstripe.com/silverstripe-forum">Silverstripe Forum</a></strong> to ask questions.
					</p>

					<div id="disqus_thread"></div><script type="text/javascript" src="http://disqus.com/forums/silverstripe-doc/embed.js"></script><noscript><a href="http://silverstripe-doc.disqus.com/?url=ref">View the forum thread.</a></noscript><a href="http://disqus.com" class="dsq-brlink">blog comments powered by <span class="logo-disqus">Disqus</span></a>
				</div>
			</div>
		</div>
		
		<div id="footer">
			<p>Documentation powered by <a href="http://www.silverstripe.org">SilverStripe</a>. Found a typo? <a href="http://github.com/chillu/silverstripe-doc-restructuring">Contribute to the Documentation Project</a>.</p>
		</div>
	</body>
</html>