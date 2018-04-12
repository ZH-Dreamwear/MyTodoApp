/*
* @Author: Administrator
* @Date:   2018-04-03 23:23:43
* @Last Modified by:   Administrator
* @Last Modified time: 2018-04-13 02:38:11
*/

//这样写法的原因是为了安全，前面加分号是为了杜绝前面的代码没有加分号造成错误
;(function(){
	'use strict';
	
	var $form_add_task = $('.add-task')
	, $delete_task 
	, $detail_task
	, $task_detail = $('.task-detail')
	, $task_detail_mask = $('.task_detail_mask')
	, task_list = []
	;
	
	init();

	//绑定提交按钮事件
	$form_add_task.on('submit',function(e){
		var new_task = {}, $input;
		/*禁用默认行为*/
		e.preventDefault();
		/*获取新Task的值*/
		$input = $(this).find('input[name=content]');
		new_task.content = $input.val();
		if(!new_task.content) return;
		if(add_task(new_task)){
			render_task_list();
			$input.val(null);
		}
	})
	//刷新localStorage数据并渲染模板
	function refresh_task_list(){
		store.set('task_list', task_list);
		render_task_list();
	}
	//添加task
	function add_task(new_task){
		/*将新Task推入task_list*/
		task_list.push(new_task);
		/*更新localStorage*/
		refresh_task_list();
		return true;
	}
	//删除task
	function delete_task(index){
		if(index===undefined || !task_list[index]) return;
		delete task_list[index];
		refresh_task_list();
	}

	function init(){
		task_list = store.get('task_list') || [];
		if(task_list.length){
			render_task_list();
		}
	}
	//渲染全部Task
	function render_task_list(){
		var $task_list = $('.task-list');
		//如果不清空，则每添加一次任务都会加上以前添加的任务
		$task_list.html('');
		for(var i=0;i<task_list.length;i++){
			var $task = render_task_item(task_list[i],i);
			$task_list.append($task);
		}

		$delete_task = $('.opreation.delete');
		$detail_task = $('.opreation.detail');
		listen_task_delete();
		listen_task_detail();
	}
	//渲染单条模板
	function render_task_item(data, index){
		if(!data || !index) return;
		var list_item_tpl = 
		'<div class="task-item" index="' + index + '">' +
		'<span><input type="checkbox"></span>' +
		'<span class="task-content">'+ data.content +'</span>' +
		'<span class="opreation detail">详情</span>' +
		'<span class="opreation delete">删除</span>' +
		'</div>';

		return $(list_item_tpl);
	}
	//查找并监听所有删除按钮的点击事件
	function listen_task_delete() {
		$delete_task.on('click',function(){
		var $this = $(this);
		//找到删除按钮所在的task元素
		var $item = $this.parent();
		console.log($item);
		var index = $item.attr('index');
		console.log(index);
		var tmp = confirm('Are you sure?');
		tmp ? delete_task(index) : null;
	});
	}
	//监听task_detail的点击事件
	function listen_task_detail(){
		$detail_task.on('click', function(){
			var $this = $(this);
			var $item = $this.parent();
			var index = $item.attr('index');
			console.log(index);
			show_task_detail(index);
		});
	}
	//将task_detail展示出来
	function show_task_detail(index){
		render_task_detail(index);
		$task_detail_mask.show();
		$task_detail.show();
		hide_task_detail();
	}
	//点击详情外边的区域可以隐藏详情页面
	function hide_task_detail(){
		$task_detail_mask.on('click', function(){
			$task_detail.hide();
			$task_detail_mask.hide();
		});
	}
	//渲染详情页面
	function render_task_detail(index){
		if (index === undefined || !task_list[index])
			return;

		var item = task_list[index];
		var tpl = '<div>' +
			'<div class="content">' +
			'<p class="task">' + item.content + '<p>' +
			'</div>' +
			'<div>' +
			'<div class="desc">' +
			'<textarea></textarea>' +
			'</div>' +
			'</div>' +
			'<div class="remind">' +
			'<p>提醒时间<p>' +
			'<input type="date">' +
			'<button type="submit">更新</button>' +
			'</div>' +
			'</div>';
			$task_detail.html('');
			$task_detail.html(tpl);
	}




})();