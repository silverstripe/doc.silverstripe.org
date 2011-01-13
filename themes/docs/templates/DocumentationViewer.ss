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
				<div id="language">
				 	$LanguageForm
				</div>
				
				<h1>
					<a href="http://www.silverstripe.com" title="Visit SilverStripe.com" class="ssLogo">&nbsp;</a>
					<a href="$Link" title="Documentation"><span><% _t('SILVERSTRIPEDOCUMENTATION', 'Documentation') %></span></a>
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
					<div id="versions-nav">
						<h2>Versions:</h2>
						
						<!--
<ul>
							<% control Versions %>
								<% if MajorRelease %>
									<li class="major-release"><a href="$Link" class="$LinkingMode">$Title</a></li>
								<% else %>
									<li class="module-only"><a href="$Link" class="$LinkingMode">$Title</a></li>
								<% end_if %>
							<% end_control %>
						</ul>
-->
						<ul>
							<li class="major-release"><a href="$Link" class="$LinkingMode">2.2</a></li>
							<li class="major-release current">2.4</li>
							<li class="major-release"><a href="$Link" class="$LinkingMode">3.0</a></li>
							<li class="module-only"><a href="$Link" class="$LinkingMode">1.3.2</a></li>
						</ul>
					</div>
				</div>
				
				<div id="content" class="typography">
					
					
<div class="warningBox">
						<div class="warningBoxTop">
							<h1>We're sorry&#8230;</h1>
							<p>The page you are looking for might have moved, no longer exists or is not currently available.</p>
							<h5>Perhaps you could&#8230;</h5>
							<p>return to the <a href="#">homepage</a> or <a href="#">try searching</a>.</p>
							<h5>Search results for similar/related phrases</h5>
							<ul class="resetStyle">
								<li><a href="#">Installing</a></li>
								<li><a href="#">Upgrading</a></li>
								<li><a href="#">Server-requirements</a></li>
								<li><a href="#">Suggested-web-hosts</a></li>
							</ul>
						</div>
						<div class="warningBoxBottom">
							
							<ul>
								<li><a href="#">Report a missing link</a></li>
								<li><a href="#">Report a bug or a concren</a></li>
							</ul>
						</div>
					</div>
				<!--
					<div class="info">
						<h5>This is a info message</h5>
						<p>Vivamus scelerisque, lacus non elementum vestibulum, eros odio gravida sem, vitae hendrerit leo velit in eros.</p>
						<a href="#" class="close" title="Close notification">close</a>
					</div>
					<div class="notice">
						<h5>This is a notification</h5>
						<p>You are currently browsing the SilverStripe documentation for the 2.3 version. You can switch to another version: <a href="#">2.2</a>, <a href="#">2.3.6</a>, <a href="#">2.4</a>
</p>
						<a href="#" class="close" title="Close notification">close</a>
					</div>
					<div class="warning">
						<h5>This is a warning message</h5>
						<p>This version of SilverStripe is no longer maintained anymore.
If some of your projects still use this version, consider <a href="">upgrading as soon as possible</a>.</p>
						<a href="#" class="close" title="Close notification">close</a>
					</div>
					<div class="hint">
						<h5>Tip: See also...</h5>
						<p>This is an example of a hint to help users who are finding difficulty in understanding the full concept <a href="#">link to surporting document</a>.</p>
					</div>
-->
					
					
					$Layout
					
					<!--
					<h4>Table</h4>
					<table>
						<thead>
							<tr>
								<td>Id</td><td>Model</td><td>Foreign Key</td><td>Key Data</td>
							</tr>
						</thead>
						<tr>
							<td>1</td><td>Resource</td><td>schema</td><td>2009-02-25</td>
						</tr>
						<tr>
							<td>1</td><td>Resource</td><td>schema</td><td>2009-02-25</td>
						</tr>
						<tr>
							<td>1</td><td>Resource</td><td>schema</td><td>2009-02-25</td>
						</tr>
						<tr>
							<td>1</td><td>Resource</td><td>schema</td><td>2009-02-25</td>
						</tr>
						<tr>
							<td>1</td><td>Resource</td><td>schema</td><td>2009-02-25</td>
						</tr>
					</table>
					
					<div class="pageSkip message">
			            <a href="">&laquo; Previous Page</a> 
			            <span class="separator">|</span>
			            <a href="">Next Page &raquo;</a>
    				</div>
    				
    			-->	
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
			<p>Documentation powered by <a href="http://www.silverstripe.org">SilverStripe</a>. <a href="http://github.com/chillu/silverstripe-doc-restructuring">Contribute to the Documentation Project</a>.
			<br />Except where otherwise noted, content on this wiki is licensed under <a class="urlextern" rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">CC Attribution-Noncommercial-Share Alike 3.0 Unported</a><a href="http://creativecommons.org/licenses/by/3.0/nz/" rel="license"><img class="ccLogo" src="http://i.creativecommons.org/l/by/3.0/nz/80x15.png" style="border-width: 0pt;" alt="Creative Commons License"></a></p>
		</div>
	</body>
</html>