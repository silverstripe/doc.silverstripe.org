<div id="sidebar">
	<% if Menu(2) %>	
		<ul id="sub-navigation">
			<% control Menu(2) %>
				<li class="$LinkingMode">
					<a href="$Link">$MenuTitle</a>
					
					<% if LinkOrSection = section %>
						<% if Children %>
							<ul>
								<% control Children %>
									<li class="$LinkingMode">
										<a href="$Link">$MenuTitle</a>
										
										
										<% if LinkOrSection = section %>
											<% if Children %>
												<ul>
													<% control Children %>
														<li class="$LinkingMode">
															<a href="$Link">$MenuTitle</a>
														</li>
													<% end_control %>
												</ul>
											<% end_if %>
										<% end_if %>
									</li>	
								<% end_control %>
							</ul>
						<% end_if %>
					<% end_if %>
				</li>
			<% end_control %>
		</ul>
	<% end_if %>
</div>