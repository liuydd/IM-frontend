import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import BoardUI from "../components/BoardUI";
import { CREATE_SUCCESS, FAILURE_PREFIX, LOGIN_REQUIRED, UPDATE_SUCCESS } from "../constants/string";
import { getBlankBoard, stepBoard, flipCell, boardToString, stringToBoard } from "../utils/logic";
import { NetworkError, NetworkErrorType, request } from "../utils/network";
import { RootState } from "../redux/store";
import { resetBoardCache, setBoardCache } from "../redux/board";
import { useSelector, useDispatch } from "react-redux";
import LoginScreen from "./login";
import RegisterScreen from "./register";


const IndexScreen = () => {
    return (
        <>
            <h1>Login</h1>
            <p>还没有账号?请注册</p>
            <p>注意：密码只能包含字母和数字，长度不能小于8，不能大于16</p>
            <p><RegisterScreen /></p>
        </>
    );
};

export default IndexScreen;