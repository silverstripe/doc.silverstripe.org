<% if $Versions %>
    <div class="versions-heading">Versions:</div>
	<div class="versions">
		<ul>
			<% loop $Versions.sort("Title DESC") %>
				<% if not $Archived %>
					<li><a href="$Link" class="$LinkingMode">$Title<% if $IsStable %> (stable)<% end_if %></a></li>
				<% end_if %>
			<% end_loop %>
		</ul>
	</div>
	<form id="VersionsArchive">
		<select id="VersionSelect" onchange="location.href=VersionsArchive.VersionSelect.options[selectedIndex].value">
			<option>Archived versions</option>
			<% loop $Versions.sort("Title DESC").limit(20) %>
				<% if $Archived %>
     				<option value="$Link">$Title</option>
				<% end_if %>
     		<% end_loop %>
		</select>
	</form>
<% end_if %>
