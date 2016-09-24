<?php
	//获取客户端的请求数据
	$username = $_POST['user_name'];
	$level = $_POST['level'];
	$time = date("Y-m-d H:i:s");
	//操作MySQL数据库 - 新增数据
	$conn = mysqli_connect('127.0.0.1','root','','jd',3306);
	$sql = 'SET NAMES UTF8';
	mysqli_query($conn,$sql);

	$sql1 = "INSERT INTO jd_lottery VALUES(NULL,'$username','$time','$level')";
	$result = mysqli_query($conn,$sql1);
	if($result){//表示SQL语句执行成功
		//向客户端响应抽奖的剩余次数
		$sql2 = "SELECT SUM(price) FROM jd_orders WHERE user_name = '$username'";
		$result = mysqli_query($conn,$sql2);
		
		$row = mysqli_fetch_array($result,MYSQLI_NUM);
		$totalprice = $row[0];//3941.70
		//总抽奖次数
		$total = floor(floatval($totalprice)/1000);
		//TODO 当前用户已抽奖次数
		$sql3 = "SELECT COUNT(id) FROM jd_lottery WHERE user_name = '$username'";
		$result2 = mysqli_query($conn,$sql3);
		$row2 = mysqli_fetch_array($result2,MYSQLI_NUM);
		//剩余抽奖次数
		$left = $total-$row2[0];
		//构建数据结构 - array
		$arr = array(
			'total' => $total,
			'left' => $left
		);
		echo json_encode($arr);
	}
?>