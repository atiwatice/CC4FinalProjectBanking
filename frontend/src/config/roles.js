// component config
const components = {
  login: {
    component: "Login",
    url: "/login"
  },
  register: {
    component: "Register",
    url: "/register"
  },
  homepage: {
    component: "Homepage",
    url: "/homepage",

  },
  service:{
    component:'Servicepage',
    url:'/service'
  },
  serviceaccount: {
    componet: "Accountpage",
    url: "/service/account"
  },
  servicetransfer: {
    component: "Transferpage",
    url: "/service/transfer"
  },
  servicestopaccount: {
    component: "Stopaccountpage",
    url: "/service/stopaccount"
  },
  servicepayment: {
    component: "Paymentpage",
    url: "/service/payment"
  },
  serviceadministrator: {
    component: "Adminpage",
    url: "/service/administrator"
  }
};

export default {
  admin: {
    routes: [components.homepage,components.service],
    redirect: '/homepage',
    page:'homepage'
  },
  user: {
    routes: [
      components.homepage,
      components.service
    ],
    redirect: '/homepage',
    page:'homepage'
  },
  guest: {
    routes: [components.login, components.register, components.homepage],
    redirect: '/login',
    page:'login'
  }
};
