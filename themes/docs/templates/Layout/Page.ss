<% if Menu(2) %>
	<% include Sidebar %>
<% end_if %>

<div id="content" class="<% if Menu(2) %>has-sidebar<% end_if %>">
	<h2>$Title</h2>

	$Content
	$Form
	$PageComments
</div>