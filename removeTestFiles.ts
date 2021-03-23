import * as shell from "shelljs";

shell.rm("-r", "dist/test");
shell.rm("dist/**/*.test.js");
shell.rm("dist/**/*.test.js.map");
