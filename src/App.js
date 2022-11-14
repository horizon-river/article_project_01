import logo from "./logo.svg";
import "./App.css";

import axios from "axios";
import React from "react";

import { Routes, Route, useNavigate } from "react-router-dom";

// 도메인이 달라도 쿠키를 공유하게 해줌
axios.defaults.withCredentials = true;

function Write() {
  const navigation = useNavigate();

  const { loginUser } = React.useContext(StoreContext);

  const [data, setData] = React.useState({
    title: "",
    body: "",
  });

  const 데이터변경 = (event) => {
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
  };

  const 게시글작성 = async () => {
    await axios({
      url: "http://localhost:4000/article",
      method: "POST",
      data: data,
    })
      .then((res) => {
        if (res.data.code === "success") {
          alert(res.data.message);
          navigation("/");
        }
      })
      .catch(() => {});
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 12 }}>
      <h2>게시글 작성</h2>
      <h3>제목</h3>
      <input name="title" type="text" onChange={데이터변경} />
      <h3>내용</h3>
      <textarea
        name="body"
        cols="50"
        rows="10"
        onChange={데이터변경}
      ></textarea>
      <button onClick={게시글작성} type="button" style={{ marginTop: 12 }}>
        작성하기
      </button>
    </div>
  );
}

function Join() {
  const navigation = useNavigate();

  const [data, setData] = React.useState({
    id: "",
    pw: "",
  });

  const 데이터변경 = (event) => {
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
  };

  const 회원가입 = async () => {
    /**
     * GET : 가져올때
     * POST : 무언가를 만들때
     */
    await axios({
      url: "http://localhost:4000/join",
      method: "POST",
      data: data,
    })
      .then((res) => {
        const { code, message } = res.data;

        if (code === "success") {
          alert(message);
          navigation("/login");
        }

        if (code === "error") {
          alert(message);
        }
      })
      .catch((e) => {
        console.log("join Error", e);
      });

    console.log(data);
  };

  return (
    <div>
      <input type="text" name="id" onChange={데이터변경} />
      <input type="password" name="pw" onChange={데이터변경} />
      <button type="button" onClick={회원가입}>
        회원가입
      </button>
    </div>
  );
}

function Login() {
  const navigation = useNavigate();

  const [data, setData] = React.useState({
    id: "",
    pw: "",
  });

  const 데이터변경 = (event) => {
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
  };

  const 로그인 = async () => {
    await axios({
      url: "http://localhost:4000/login",
      method: "POST",
      data: data,
    })
      .then((res) => {
        const { code, message } = res.data;

        alert(message);

        if (code === "success") {
          window.location.href = "/";
        }
      })
      .catch((e) => {
        console.log("login Error", e);
      });
  };

  return (
    <div>
      <input type="text" name="id" onChange={데이터변경} />
      <input type="password" name="pw" onChange={데이터변경} />
      <button type="button" onClick={로그인}>
        로그인
      </button>
    </div>
  );
}

function Main() {
  const navigation = useNavigate();

  const { loginUser } = React.useContext(StoreContext);

  const [article, setArticle] = React.useState([]);

  const 게시글정보 = async () => {
    axios({
      url: "http://localhost:4000/getArticle",
      method: "GET",
    })
      .then((res) => {
        setArticle(res.data);
      })
      .catch((e) => {
        console.log("article Error", e);
      });
  };

  React.useEffect(() => {
    게시글정보();
  }, []);

  return (
    <div>
      <h2>{loginUser.nickname}님 안녕하세요!</h2>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>내용</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          {article.length > 0 &&
            article.map((item) => {
              return (
                <tr key={item.seq}>
                  <th>{item.seq}</th>
                  <th>{item.title}</th>
                  <th>{item.body}</th>
                  <th>{item.user_seq}</th>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * 1. React Router DOM (완료)
 * npm install react-router-dom
 * 2. Context Provider (완료)
 */

const StoreContext = React.createContext({});

function App() {
  const [loginUser, setLoginUser] = React.useState({});

  const 세션정보가져오기 = async () => {
    await axios({
      url: "http://localhost:4000/user",
    })
      .then((res) => {
        setLoginUser(res.data);
      })
      .catch((e) => {
        console.log("user Error", e);
      });
  };

  React.useEffect(() => {
    세션정보가져오기();
  }, []);

  return (
    <StoreContext.Provider value={{ loginUser }}>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/join" element={<Join />} />
        <Route exact path="/write" element={<Write />} />
      </Routes>
    </StoreContext.Provider>
  );
}

export default App;
