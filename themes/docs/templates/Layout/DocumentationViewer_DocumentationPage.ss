<div id="documentation-page" class="box" data-swiftype-index="true">
	<% if VersionWarning %>
		<% include DocumentationVersion_warning Version=$Entity.Version %>
	<% end_if %>

	<% include DocumentationTableContents %>


	$Content.RAW

	<div class="quickfeedback clearfix">$QuickFeedbackForm</div>

	<% include DocumentationNextPrevious %>

	<% if EditLink %>
		<% include DocumentationEditLink %>
	<% end_if %>


	<% include DocumentationComments %>
</div>
