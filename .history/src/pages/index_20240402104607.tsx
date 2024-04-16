import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import BoardUI from "../components/BoardUI";
import { CREATE_SUCCESS, FAILURE_PREFIX, LOGIN_REQUIRED, UPDATE_SUCCESS } from "../constants/string";
import { getBlankBoard, stepBoard, flipCell, boardToString, stringToBoard } from "../utils/logic";
import { NetworkError, NetworkErrorType, request } from "../utils/network";
import { RootState } from "../redux/store";
import { resetBoardCache, setBoardCache } from "../redux/board";
import { useSelector, useDispatch } from "react-redux";

const IndexScreen = () => {
    
};

export default IndexScreen;