"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Autocomplete,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/uk";
import "dayjs/locale/en";
import { useLocale, useTranslations } from "next-intl";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { Work, WorkFormData as OriginalWorkFormData } from "@/types/works";

interface WorkFormData extends Omit<OriginalWorkFormData, "workDate"> {
  workDate: Dayjs;
}

const serviceKeys = [
  "diagnostics",
  "repair",
  "adjustment",
  "replacement",
  "cleaning",
];

export default function WorksManager() {
  const t = useTranslations("common.admin.worksManager");
  const tServices = useTranslations("common.admin.worksManager.services");
  const locale = useLocale();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<WorkFormData>({
    title: "",
    locale: "uk",
    status: "draft",
    customerInitials: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vinHashed: "",
    manufacturerId: "",
    injectorId: "",
    services: [],
    workDate: dayjs(),
    beforeImageURLs: [],
    afterImageURLs: [],
    testimonial: "",
    technicianUid: "tech-1",
  });

  const availableServices = serviceKeys.map((key) => tServices(key));

  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "works"));
      const worksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Work[];
      setWorks(worksData);
    } catch (err: any) {
      setError(t("errors.load") + ": " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (work?: Work) => {
    if (work) {
      setEditingWork(work);
      setFormData({
        ...work,
        workDate:
          work.workDate instanceof Timestamp
            ? dayjs(work.workDate.toDate())
            : dayjs(new Date(work.workDate)),
      } as WorkFormData);
    } else {
      setEditingWork(null);
      setFormData({
        title: "",
        locale: "uk",
        status: "draft",
        customerInitials: "",
        vehicleMake: "",
        vehicleModel: "",
        vehicleYear: "",
        vinHashed: "",
        manufacturerId: "",
        injectorId: "",
        services: [],
        workDate: dayjs(),
        beforeImageURLs: [],
        afterImageURLs: [],
        testimonial: "",
        technicianUid: "tech-1",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingWork(null);
    setError("");
  };

  const handleSave = async () => {
    try {
      setError("");

      if (
        !formData.title ||
        !formData.customerInitials ||
        !formData.vehicleMake
      ) {
        setError(t("errors.requiredFields"));
        return;
      }

      const workData = {
        ...formData,
        workDate: Timestamp.fromDate(formData.workDate.toDate()),
        updatedAt: serverTimestamp(),
      };

      if (editingWork?.id) {
        await updateDoc(doc(db, "works", editingWork.id), workData);
        setSuccess(t("success.updated"));
      } else {
        await addDoc(collection(db, "works"), {
          ...workData,
          createdAt: serverTimestamp(),
          createdByUid: "admin-1",
        });
        setSuccess(t("success.created"));
      }

      handleCloseDialog();
      loadWorks();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(t("errors.save") + ": " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== "undefined" && !window.confirm(t("confirmDelete")))
      return;
    try {
      await deleteDoc(doc(db, "works", id));
      setSuccess(t("success.deleted"));
      loadWorks();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(t("errors.delete") + ": " + err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" >
      <Box sx={{   }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            mb: 3,
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "#004975", fontWeight: "bold" }}
          >
            {t("title", { count: works.length })}
          </Typography>
          <PrimaryButton
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()
          
            }
            sx={{
              width:{xs: "100%", sm: 'auto'}
            }}
          >
            {t("addNew")}
          </PrimaryButton>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, display: { xs: "none", sm: "block" } }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#F8F9FA" }}>
              <TableRow>
                <TableCell>
                  <strong>{t("table.title")}</strong>
                </TableCell>
                <TableCell>
                  <strong>{t("table.vehicle")}</strong>
                </TableCell>
                <TableCell>
                  <strong>{t("table.customer")}</strong>
                </TableCell>
                <TableCell>
                  <strong>{t("table.date")}</strong>
                </TableCell>
                <TableCell>
                  <strong>{t("table.status")}</strong>
                </TableCell>
                <TableCell>
                  <strong>{t("table.locale")}</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>{t("table.actions")}</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {works.map((work) => (
                <TableRow key={work.id} hover>
                  <TableCell>{work.title}</TableCell>
                  <TableCell>
                    {work.vehicleMake} {work.vehicleModel}
                  </TableCell>
                  <TableCell>{work.customerInitials}</TableCell>
                  <TableCell>
                    {work.workDate instanceof Timestamp
                      ? work.workDate.toDate().toLocaleDateString(locale)
                      : new Date(work.workDate).toLocaleDateString(locale)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(
                        `form.status${
                          work.status.charAt(0).toUpperCase() +
                          work.status.slice(1)
                        }` as any,
                        work.status
                      )}
                      size="small"
                      color={
                        work.status === "published" ? "success" : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={work.locale.toUpperCase()} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleOpenDialog(work)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(work.id!)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: { xs: "block", md: "none" },
          }}
        >
          {works.map((work) => (
            <Paper
              key={work.id}
              sx={{ p: 2, mb: 2, boxShadow: 2, borderRadius: 2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1.5,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#004975",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    pr: 1,
                  }}
                >
                  {work.title}
                </Typography>

                <Box sx={{ display: "flex" }}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(work)}
                    sx={{ color: "#004975" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(work.id!)}
                    sx={{ color: "#d32f2f" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {t("table.vehicle")}:
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: "medium",
                      color: "text.primary",
                      ml: 0.5,
                    }}
                  >
                    {work.vehicleMake} {work.vehicleModel}
                  </Typography>
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {t("table.customer")}:
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: "medium",
                      color: "text.primary",
                      ml: 0.5,
                    }}
                  >
                    {work.customerInitials}
                  </Typography>
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {t("table.date")}:
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: "medium",
                      color: "text.primary",
                      ml: 0.5,
                    }}
                  >
                    {work.workDate instanceof Timestamp
                      ? work.workDate.toDate().toLocaleDateString(locale)
                      : new Date(work.workDate).toLocaleDateString(locale)}
                  </Typography>
                </Typography>

                <Box
                  sx={{ display: "flex", gap: 2, alignItems: "center", mt: 1 }}
                >
                  <Chip
                    label={t(
                      `form.status${
                        work.status.charAt(0).toUpperCase() +
                        work.status.slice(1)
                      }` as any,
                      work.status
                    )}
                    size="small"
                    color={work.status === "published" ? "success" : "default"}
                  />
                  <Chip label={work.locale.toUpperCase()} size="small" />
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#004975" }}>
          {editingWork ? t("dialog.titleEdit") : t("dialog.titleNew")}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={locale}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#004975" }}
              >
                {t("form.groupBasic")}
              </Typography>
              <TextField
                label={t("form.title")}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                fullWidth
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>{t("form.locale")}</InputLabel>
                  <Select
                    value={formData.locale}
                    label={t("form.locale")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        locale: e.target.value as "uk" | "en",
                      })
                    }
                  >
                    <MenuItem value="uk">{t("form.localeUk")}</MenuItem>
                    <MenuItem value="en">{t("form.localeEn")}</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>{t("form.status")}</InputLabel>
                  <Select
                    value={formData.status}
                    label={t("form.status")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                  >
                    <MenuItem value="draft">{t("form.statusDraft")}</MenuItem>
                    <MenuItem value="published">
                      {t("form.statusPublished")}
                    </MenuItem>
                    <MenuItem value="archived">
                      {t("form.statusArchived")}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#004975" }}
              >
                {t("form.groupVehicle")}
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label={t("form.customerInitials")}
                  value={formData.customerInitials}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customerInitials: e.target.value,
                    })
                  }
                  fullWidth
                />
                <TextField
                  label={t("form.vinHashed")}
                  value={formData.vinHashed}
                  onChange={(e) =>
                    setFormData({ ...formData, vinHashed: e.target.value })
                  }
                  fullWidth
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label={t("form.vehicleMake")}
                  value={formData.vehicleMake}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleMake: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  label={t("form.vehicleModel")}
                  value={formData.vehicleModel}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleModel: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  label={t("form.vehicleYear")}
                  value={formData.vehicleYear}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleYear: e.target.value })
                  }
                  fullWidth
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#004975" }}
              >
                {t("form.groupDetails")}
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label={t("form.manufacturerId")}
                  value={formData.manufacturerId}
                  onChange={(e) =>
                    setFormData({ ...formData, manufacturerId: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  label={t("form.injectorId")}
                  value={formData.injectorId}
                  onChange={(e) =>
                    setFormData({ ...formData, injectorId: e.target.value })
                  }
                  fullWidth
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <DatePicker
                  label={t("form.workDate")}
                  value={formData.workDate}
                  onChange={(newVal) =>
                    setFormData({ ...formData, workDate: newVal || dayjs() })
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
                <Autocomplete
                  multiple
                  freeSolo
                  options={availableServices}
                  value={formData.services}
                  onChange={(e, newValue) =>
                    setFormData({ ...formData, services: newValue })
                  }
                  renderInput={(params) => (
                    <TextField {...params} label={t("form.services")} />
                  )}
                  fullWidth
                />
              </Box>

              <TextField
                multiline
                rows={3}
                label={t("form.testimonial")}
                value={formData.testimonial}
                onChange={(e) =>
                  setFormData({ ...formData, testimonial: e.target.value })
                }
                fullWidth
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>{t("dialog.cancel")}</Button>
          <PrimaryButton onClick={handleSave}>
            {editingWork ? t("dialog.update") : t("dialog.create")}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
