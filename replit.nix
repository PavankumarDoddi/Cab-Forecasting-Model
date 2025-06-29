{ pkgs }: {
  deps = [
    pkgs.python311Full
    pkgs.nodejs_18
  ];
  env = {
    PYTHONPATH = ".";
  };
}
