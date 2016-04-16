function Flow() {
	this.options = {
		init_density: 1,
		density_left: 1.5,
		density_right: 0.5,
		init_velocity: 0,
		obstacle_pos: 1/4,
		obstacle_size: 1/5
	};

	this.boundary = function(cells_src, cells_dst) {
		bounceback_top(cells_src, cells_dst);
		bounceback_bottom(cells_src, cells_dst);
		bounceback_topleft(cells_src, cells_dst);
		bounceback_bottomleft(cells_src, cells_dst);
		bounceback_topright(cells_src, cells_dst);
		bounceback_bottomright(cells_src, cells_dst);
	};

	this.init_cells = function(cells) {
		var flow_vel = new Vec2(this.options.init_velocity, 0);
		var v_dot_v = flow_vel.dot(flow_vel);
		var max_c = cells.length - 1;

		for (var r = 0; r < cells[0].length; r++) {

			// left & right
			for (var i = 0; i < 9; i++) {
				cells[0][r][i] = get_equi(i, this.options.density_left, flow_vel, v_dot_v);
				cells[max_c][r][i] = get_equi(i, this.options.density_right, flow_vel, v_dot_v);
			}

			// the rest
			for (var c = 1; c < max_c; c++) {
				for (i = 0; i < 9; i++) {
					cells[c][r][i] = get_equi(i, this.options.init_density, flow_vel, v_dot_v);
				}
			}
		}
	};

	this.init_obstacles = function(obstacles) {
		// position of default obstacle
		var obstacle_col = Math.floor(this.options.obstacle_pos * lbm_options.cols);
		var obstacle_row_min = Math.floor(lbm_options.rows / 2 - this.options.obstacle_size / 2 * lbm_options.rows);
		var obstacle_row_max = Math.floor(lbm_options.rows / 2 + this.options.obstacle_size / 2 * lbm_options.rows);

		for (var r = obstacle_row_min; r <= obstacle_row_max; r++) {
			obstacles[obstacle_col][r] = true;
		}
	};

	this.mouse_action = function(cells, position) {
		var c = position.x;
		var r = position.y;
		obstacles[c][r] = !obstacles[c][r];
	};
}