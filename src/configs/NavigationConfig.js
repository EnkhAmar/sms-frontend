import {
  DashboardOutlined,
  ContactsOutlined,
  SolutionOutlined,
  BookOutlined,
  BranchesOutlined,
  TeamOutlined,
  BarsOutlined,
  AppstoreOutlined,
  GroupOutlined,
  CalendarOutlined,
  TableOutlined,
  ToolOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APP_PREFIX_PATH } from 'configs/AppConfig'

const dashBoardNavTree = [{
  key: 'dashboards',
  path: ``,
  title: 'sidenav.dashboard',
  icon: DashboardOutlined,
  breadcrumb: false,
  submenu: [
    {
      key: 'dashboards-general',
      path: `${APP_PREFIX_PATH}/dashboards/general`,
      title: 'sidenav.dashboard.general',
      icon: DashboardOutlined,
      breadcrumb: false,
      submenu: []
    }, {
      key: 'dashboards-class',
      path: `${APP_PREFIX_PATH}/dashboards/class_students`,
      title: 'sidenav.dashboard.class',
      icon: ContactsOutlined,
      breadcrumb: false,
      submenu: []
    }, {
      key: 'dashboards-operator',
      path: `${APP_PREFIX_PATH}/dashboards/operator`,
      title: 'sidenav.dashboard.operator',
      icon: PhoneOutlined,
      breadcrumb: false,
      submenu: []
    },
  ]
}]

const school = () => (
  <span>
    <FontAwesomeIcon icon="coffee" />
  </span>
)

const adminNavTree = [{
  key: '',
  path: '',
  title: 'sidenav.admin',
  icon: DashboardOutlined,
  breadcrumb: false,
  submenu: [
    {
      key: 'schools',
      path: `${APP_PREFIX_PATH}/schools`,
      title: 'sidenav.school',
      icon: BookOutlined,
      breadcrumb: false,
      submenu: [
        {
          key: 'schools-school',
          path: `${APP_PREFIX_PATH}/schools/school`,
          title: 'sidenav.school.schools',
          icon: '',
          breadcrumb: false,
          submenu: []
        }, {
          key: 'schools-branch',
          path: `${APP_PREFIX_PATH}/schools/branch`,
          title: 'sidenav.school.branch',
          icon: '',
          breadcrumb: false,
          submenu: []
        }
      ]
    }, {
      key: 'admin-class',
      path: `${APP_PREFIX_PATH}/class/`,
      title: 'sidenav.admin.class',
      icon: GroupOutlined,
      breadcrumb: false,
      submenu: []
    }, {
      key: 'staffs',
      path: `${APP_PREFIX_PATH}/staffs`,
      title: 'sidenav.admin.staffs',
      icon: TeamOutlined,
      breadcrumb: false,
      submenu: []
    }, {
      key: 'admin-students',
      path: `${APP_PREFIX_PATH}/students`,
      title: 'sidenav.admin.students',
      icon: SolutionOutlined,
      breadcrumb: false,
      submenu: []
    }, {
      key: 'admin-lessons',
      path: `${APP_PREFIX_PATH}/lessons`,
      title: 'sidenav.admin.lessons',
      icon: BarsOutlined,
      breadcrumb: false,
      submenu: []
    }, {
      key: 'admin-rooms',
      path: `${APP_PREFIX_PATH}/rooms`,
      title: 'sidenav.admin.rooms',
      icon: AppstoreOutlined,
      breadcrumb: false,
      submenu: []
    }, {
      key: 'admin-datasheet',
      path: `${APP_PREFIX_PATH}/datasheet`,
      title: 'sidenav.admin.datasheet',
      icon: TableOutlined,
      breadcrumb: false,
      submenu: []
    }, {
      key: 'admin-schedule',
      path: `${APP_PREFIX_PATH}/schedule`,
      title: 'sidenav.admin.schedule',
      icon: CalendarOutlined,
      breadcrumb: false,
      submenu: []
    }, {
      key: 'utilities',
      path: `${APP_PREFIX_PATH}/utilities`,
      title: 'sidenav.admin.utilities',
      icon: ToolOutlined,
      breadcrumb: false,
      submenu: [
        {
          key: 'utilities-status',
          path: `${APP_PREFIX_PATH}/utilities/status`,
          title: 'sidenav.admin.utilities.status',
          icon: '',
          breadcrumb: false,
          submenu: []
        },
        {
          key: 'utilities-discount',
          path: `${APP_PREFIX_PATH}/utilities/discount`,
          title: 'sidenav.admin.utilities.discount',
          icon: '',
          breadcrumb: false,
          submenu: []
        },
        {
          key: 'utilities-datasheet-status',
          path: `${APP_PREFIX_PATH}/utilities/datasheet-status`,
          title: 'sidenav.admin.utilities.datasheetstatus',
          icon: '',
          breadcrumb: false,
          submenu: []
        },
        {
          key: 'utilities-payment-method',
          path: `${APP_PREFIX_PATH}/utilities/payment-method`,
          title: 'sidenav.admin.utilities.paymentmethod',
          icon: '',
          breadcrumb: false,
          submenu: []
        }
      ]
    },
  ]
}]

const navigationConfig = [
  ...dashBoardNavTree,
  ...adminNavTree,
]

export default navigationConfig;
