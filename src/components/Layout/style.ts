import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  footerMain: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#111827',
    color: '#FFF',
    padding: theme.spacing(2)
  },
  title: {
    fontSize: theme.typography.h5.fontSize,
    marginBottom: theme.spacing(2)
  },
  spaceSocialMedias: {}
}));
