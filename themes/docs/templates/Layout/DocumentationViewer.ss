<div id="documentation-page">
	<% if VersionWarning %>
		<% include DocumentationVersion_warning %>
	<% end_if %>
	
	<div id="content-column">
		$Content
		
		<% include Comments %>
	</div>

	<% if Content %>
	<div id="sidebar-column">
		<% include DocTableOfContents %>
		<% include DocInThisModule %>
	</div>
	<% end_if %>
</div>