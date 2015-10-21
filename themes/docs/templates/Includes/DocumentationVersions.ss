<% if Versions %>
	<div class="versions">
		<ul>
			<% loop Versions.sort("Title DESC").limit(4) %>
				<li><a href="$Link" class="$LinkingMode">$Title<% if $IsStable %> (stable)<% end_if %></a></li>
			<% end_loop %>
		</ul>
	</div>
	<form id="VersionsArchive">
			<select id="VersionSelect" onchange="location.href=VersionsArchive.VersionSelect.options[selectedIndex].value">
				<option>Archived Documentation</option>
				<% loop Versions.sort("Title DESC").limit(20, 4) %>
     			<option value="$Link">$Title</option>
     			<% end_loop %>
			</select>
		</form>
<% end_if %>
