import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

export default function WithAuth(props, ComponentToProtect) {
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);

  async function checkRoute() {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      setRedirect(true);
      return;
    }
    const token = localStorage.getItem("token");
    await fetch("/api/user/checkToken", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Username: `${localStorage.getItem("username")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("Logged in");
          setLoading(false);
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setRedirect(true);
      });
  }

  useEffect(() => {
    (async () => {
      console.log("running");
      await checkRoute();
    })();
  }, []);

  if (loading) {
    return null;
  }
  if (redirect) {
    return <Redirect to="/" />;
  } else {
    return <ComponentToProtect {...props} />;
  }
}

// import React, { Component } from "react";
// import { Redirect } from "react-router-dom";

// export default function withAuth(ComponentToProtect) {
//   return class extends Component {
//     constructor() {
//       super();
//       this.state = {
//         loading: true,
//         redirect: false,
//       };
//     }

//     componentDidMount() {
//       if (!localStorage.getItem("token")) {
//         return this.setState({ loading: false, redirect: true });
//       }

//       const token = localStorage.getItem("token");
//       fetch("/checkToken", {
//         method: "GET",
//         withCredentials: true,
//         credentials: "include",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//           Username: `${localStorage.getItem("user")}`,
//         },
//       })
//         .then((res) => {
//           if (res.status === 200) {
//             this.setState({ loading: false });
//           } else {
//             const error = new Error(res.error);
//             throw error;
//           }
//         })
//         .catch((err) => {
//           console.error(err);
//           this.setState({ loading: false, redirect: true });
//         });
//     }

//     render() {
//       const { loading, redirect } = this.state;
//       if (loading) {
//         return null;
//       }
//       if (redirect) {
//         return <Redirect to="/" />;
//       }
//       return <ComponentToProtect {...this.props} />;
//     }
//   };
// }
