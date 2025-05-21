import { useMemo, useState, useCallback } from "react";
import { format, isValid, parseISO } from "date-fns";
import { getMemoPatientAttachment } from "@/app/views/patient-details/PatientAttachments/hooks";
import ReactHtmlParser from 'html-react-parser';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import { markdownItUnderline } from 'components/common/RichTextEditor/helpers';

export const useActivityTimeline = (activities) => {
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [previewedAttachment, setPreviewedAttachment] = useState(null);
    const [attachmentsSources, setAttachmentSources] = useState([]);
    const [isAttachmentPreviewOpen, setIsAttachmentPreviewOpen] = useState(false);
    const [attachmentsLoading, setAttachmentsLoading] = useState(false);
    const hideAttachmentPreview = () => setIsAttachmentPreviewOpen(false);

    const activityLabels = {
      UPDATE_PATIENT_NOTE: "Patient Note Updated",
      DELETE_PATIENT_NOTE: "Patient Note Deleted",
      CREATE_PATIENT_NOTE: "Patient Note Created",
      CREATE_TASK: "Task Created",
      ASSIGN_TASK: "Task Assigned",
      DELETE_TASK: "Task Deleted",
      MARK_COMPLETE: "Task Completed",
      CREATE_TASK_GROUP: "Workflow Deployed",
      DELETE_TASK_BUNDLE: "Workflow Deleted",
      DELETE_ATTACHMENT_PATIENT: "Patient Attachment Deleted",
      CREATE_ATTACHMENT_PATIENT: "Patient Attachment Added",
      UPDATE_ATTACHMENT_PATIENT: "Patient Attachment Updated",
    };

    const activityPerformedType = (actionType = "") => {
      if (actionType === "CREATE_ATTACHMENT_PATIENT") return "Added By: ";
      if (actionType.includes("UPDATE")) return "Updated By: ";
      if (actionType.includes("DELETE")) return "Deleted By: ";
      if (actionType.includes("MARK_COMPLETE")) return "Completed By: ";
      if (actionType.includes("CREATE")) return "Created By: ";
      return null;
    };

    const mergePatientUpdateAndMetaActivities = useCallback((activities) => {
      const merged = [];

      const getFormattedTime = (activity) => {
        const date = parseISO(activity?.activityDateTime);
        return isValid(date) ? format(date, "yyyy-MM-dd HH:mm") : null;
      };

      for (let i = 0; i < activities.length; i++) {
        const current = activities[i];
        const next = activities[i + 1];

        const currentTime = getFormattedTime(current);
        const nextTime = next ? getFormattedTime(next) : null;

        const isPatientMetaMerge =
          currentTime &&
          nextTime &&
          currentTime === nextTime &&
          ((current.actionType === "UPDATE_PATIENT" && next.actionType === "SAVE_PATIENT_META_DATA") ||
            (current.actionType === "SAVE_PATIENT_META_DATA" && next.actionType === "UPDATE_PATIENT"));

        if (isPatientMetaMerge) {
          merged.push({
            ...current,
            contextualData: {
              ...current.contextualData,
              ...next.contextualData,
            },
          });
          i++;
          continue;
        }

        if (current.actionType === "ASSIGN_TASK" && currentTime) {
          const group = [current];

          for (let j = i + 1; j < activities.length; j++) {
            const candidate = activities[j];
            const candidateTime = getFormattedTime(candidate);

            if (
              candidate.actionType === "ASSIGN_TASK" &&
              candidateTime === currentTime
            ) {
              group.push(candidate);
              i = j;
            } else {
              break;
            }
          }

          if (group.length > 1) {
            const assignedToNames = group
              .map(a => a.contextualData?.assignedToName)
              .filter(Boolean);

            merged.push({
              ...group[0],
              contextualData: {
                ...group[0].contextualData,
                assignedToName: assignedToNames.join(", ")
              }
            });
            continue;
          }
        }
        merged.push(current);
      }
      return merged;
    }, []);

    const sortedActivities = useMemo(() => {
        
      const merged = mergePatientUpdateAndMetaActivities(activities || []);
      const attachmentsMap = new Map();
      const nonAttachments = [];
  
      for (const activity of merged) {
        if (activity?.actionType === "CREATE_ATTACHMENT_PATIENT") {
          const key = format(parseISO(activity.activityDateTime), "yyyy-MM-dd HH:mm");
          attachmentsMap.set(key, [...(attachmentsMap.get(key) || []), activity]);
        } else {
          nonAttachments.push(activity);
        }
      }
  
      const groupedAttachments = Array.from(attachmentsMap.values()).map((group) =>
        group.length === 1
          ? group[0]
          : {
              ...group[0],
              isGroupedAttachment: true,
              groupedAttachments: group,
            }
      );
  
      const allActivities = [...nonAttachments, ...groupedAttachments];
      return allActivities
        .sort((a, b) => new Date(b.activityDateTime) - new Date(a.activityDateTime))
        .filter(
          (act) => selectedFilters.length === 0 || selectedFilters.includes(act.targetType)
        );
    }, [activities, selectedFilters, mergePatientUpdateAndMetaActivities]);
  
    const openPreview = useCallback(async (contextualData, activity) => {
      try {
        setAttachmentsLoading(true);
        const { targetTypeIdentifier } = activity;
        const { fileName, contentType } = contextualData;
        const { data } = await getMemoPatientAttachment(targetTypeIdentifier);
  
        const fileSource = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result?.replace(
              /data:[^;]+;base64/,
              `data:${contentType};base64`
            );
            resolve(result);
          };
          reader.onerror = () => reject(new Error("FileReader error"));
          reader.readAsDataURL(data);
        });
  
        const attachment = {
          attachmentIdentifier: targetTypeIdentifier,
          fileName,
          fileSource,
          contentType,
        };
  
        setPreviewedAttachment(attachment);
        setAttachmentSources([attachment]);
        setIsAttachmentPreviewOpen(true);
      } catch (err) {
        console.error("Preview error:", err);
      } finally {
        setAttachmentsLoading(false);
      }
    }, []);
  
    const toggleFilter = (type) => {
      setSelectedFilters((prev) =>
        prev.includes(type) ? prev.filter((f) => f !== type) : [...prev, type]
      );
    };
  
    const md = new MarkdownIt({
      html: true,
      breaks: false,
      linkify: true,
    }).use(markdownItUnderline);
    
    const processMarkdownValue = (markdownText) => {
      if (!markdownText) return null;
    
      let htmlValue = md.render(markdownText);
      htmlValue = htmlValue.replace(/href="(.*?)"/gi, (match, url) => {
        const decodedUrl = url.replace(/%7B/gi, '{').replace(/%7D/gi, '}');
        return `href="${decodedUrl}"`;
      });
      const sanitizedHtml = DOMPurify.sanitize(htmlValue);
      const finaltext = ReactHtmlParser(sanitizedHtml)
      console.log(finaltext)
      return finaltext;
    };

    return {
      sortedActivities,
      selectedFilters,
      toggleFilter,
      openPreview,
      hideAttachmentPreview,
      previewedAttachment,
      attachmentsSources,
      isAttachmentPreviewOpen,
      attachmentsLoading,
      processMarkdownValue,
      activityLabels,
      activityPerformedType
    };
  };