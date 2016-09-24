<?php
	//1.获取客户端的请求数据
	$user_name = $_POST['user_name'];
	//2.查询数据库得到抽奖次数
	$conn = mysqli_connect('127.0.0.1','root','','jd','3306');
	//解决中文乱码
	$sql1 = 'SET NAMES UTF8';
	mysqli_query($conn,$sql1);

	$sql2 = "SELECT SUM(price) FROM jd_orders WHERE user_name = '$user_name'";
	$result = mysqli_query($conn,$sql2);
	/*
	  解析结果集,消费总金额
	  * mysqli_fetch_assoc()
	  * mysqli_fetch_array(result,type)
	    * result - 结果集对象
		* type - 返回什么类型的数组
		  * MYSQLI_ASSOC - 关联数组
		  * MYSQLI_NUM - 索引数组
		  * MYSQLI_BOTH - 索引+关联数组
	 */
	$row = mysqli_fetch_array($result,MYSQLI_NUM);
	$totalprice = $row[0];//3941.70
	/*
	  计算当前用户的抽奖次数
	  * 人为规定每消费 1000 元获取一次抽奖
	    * 总金额/1000 = 向下取整
	  * 总金额变量的类型 - string
	    * Integer - 整型(整数)
		* Float - 浮点型(小数)
	 */
	$total = floor(floatval($totalprice)/1000);
	//TODO 当前用户已抽奖次数
	$sql3 = "SELECT COUNT(id) FROM jd_lottery WHERE user_name = '$user_name'";
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
?>