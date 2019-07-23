module "which-pm-runs" {
  export default function(): undefined | { name: string; version: string };
}
