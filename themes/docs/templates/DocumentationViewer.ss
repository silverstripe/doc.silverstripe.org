<!DOCTYPE html>

<html>
	<head>
		<% base_tag %>
		<meta charset="utf-8" />
		<title><% if PageTitle %>$PageTitle <% end_if %>SilverStripe Documentation</title>
		
		<% require javascript(sapphire/thirdparty/jquery/jquery.js) %>
		<% require javascript(http://silverstripe.org/toolbar/javascript/toolbar.min.js?site=doc&searchShow=false) %>
		<% require css(http://silverstripe.org/toolbar/css/toolbar.css) %>
		
		<% require css(themes/ssorgsites/css/ss.screen.min.css, screen) %>
		<% require css(themes/ssorgsites/css/ss.print.min.css, print) %>
		
		<% require themedCSS(DocumentationViewer) %>
	</head>
	
	<body>
		<div id="container">
			<div id="header">
				<div id="language">
				 	$LanguageForm
				</div>
				
				<h1>
					<a href="http://www.silverstripe.org" title="Visit SilverStripe.org" class="ssLogo">&nbsp;</a>
					<a href="$Top.Link" title="Documentation"><span><% _t('SILVERSTRIPEDOCUMENTATION', 'Documentation') %></span></a>
				</h1>
				
				
				<div id="breadcrumbs">
					<% include DocBreadcrumbs %>
				</div>
				<div class="clear"></div>
				
				
				<div class="clear"></div>
			</div>
			
			
			<div id="layout">
				<div class="searchBar">
					<div id="search">
						$DocumentationSearchForm
					</div>
					
					<% if Versions %>
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
					<% end_if %>
					
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
			<p>Documentation powered by <a href="http://www.silverstripe.org">SilverStripe</a>. <a href="{$BaseHref}sapphire/en/misc/contributing/#Writing-Documentation">Contribute to doc.silverstripe.org</a>, <a href="http://open.silverstripe.org/newticket/?component=Documentation">raise a bug or enhancement ticket</a>.
			<br />Except where otherwise noted, content on this wiki is licensed under <a class="urlextern" rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">CC Attribution-Noncommercial-Share Alike 3.0 Unported</a><a href="http://creativecommons.org/licenses/by/3.0/nz/" rel="license"><img class="ccLogo" src="http://i.creativecommons.org/l/by/3.0/nz/80x15.png" style="border-width: 0pt;" alt="Creative Commons License"></a></p>
		</div>
		
		<% if GoogleAnalyticsCode %>
		<script type="text/javascript">

		  var _gaq = _gaq || [];
		  _gaq.push(['_setAccount', '$GoogleAnalyticsCode']);
		  _gaq.push(['_trackPageview']);

		  (function() {
		    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		  })();

		</script>
		<% end_if %>
	</body>
</html>