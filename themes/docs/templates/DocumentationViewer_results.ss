<!DOCTYPE html>

<html>
	<% include DocumentationHead %>

	<div id="masthead" <% if Versions %>class="has_versions"<% end_if %>>
		<div class="wrapper">

			<div class="doc-breadcrumbs">
				<p>
					<div class="menu-bar">
						<a class="logo" href="https://docs.silverstripe.org/"></a>
						<a class="menu-toggle">
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</a>
					</div>
					<a class="breadcrumb" href="$BaseHref">Documentation</a>
					<span>/</span>
					<a class="breadcrumb current">Search</a>
				</p>
			</div>



		</div>
	</div>

	<div class="wrapper">
		<div id="layout" class="clearfix">

				$Layout

				<% include DocumentationFooter %>

		</div>
	</div>


	<% include DocumentationGA %>
	<% include DocumentationEnd %>
</html>
