<?php
	$loginname = $_POST['loginname'];
	$loginpwd = $_POST['loginpwd'];

	$conn = mysqli_connect('127.0.0.1','root','','jd',3306);

	$sql = "SET NAMES UTF8";
	mysqli_query($conn,$sql);

	$sql = "SELECT * FROM jd_users WHERE user_name='$loginname' AND user_pwd='$loginpwd'";
	$result = mysqli_query($conn,$sql);

	$row = mysqli_fetch_assoc($result);
	if($row===NULL){
		$row["code"] = 0;//登录失败
	}else{
		$row["code"] = 1;//登录成功
	}
	echo json_encode($row);
?>