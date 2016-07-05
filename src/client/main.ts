

require("todomvc-common");

import {Application} from "./systems/view_system/Application";
import {render} from "ramajs/dist/index";

render(Application,document.getElementById("app"));