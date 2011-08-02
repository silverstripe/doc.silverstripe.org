<div id="documentation-page">
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