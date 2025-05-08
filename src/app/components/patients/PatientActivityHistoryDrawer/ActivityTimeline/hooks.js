import { useMemo, useState, useCallback } from "react";
import { format, isValid, parseISO } from "date-fns";
import { getMemoPatientAttachment } from "@/app/views/patient-details/PatientAttachments/hooks";

export const useActivityTimeline = (activities) => {
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [previewedAttachment, setPreviewedAttachment] = useState(null);
    const [attachmentsSources, setAttachmentSources] = useState([]);
    const [isAttachmentPreviewOpen, setIsAttachmentPreviewOpen] = useState(false);
    const [attachmentsLoading, setAttachmentsLoading] = useState(false);
    const hideAttachmentPreview = () => setIsAttachmentPreviewOpen(false);
  
    const mergePatientUpdateAndMetaActivities = useCallback((activities) => {
      const merged = [];
      for (let i = 0; i < activities.length; i++) {
        const current = activities[i];
        const next = activities[i + 1];
  
        const sameTime = (a, b) => {
          const t1 = parseISO(a?.activityDateTime);
          const t2 = parseISO(b?.activityDateTime);
          return isValid(t1) && isValid(t2) && format(t1, "yyyy-MM-dd HH:mm") === format(t2, "yyyy-MM-dd HH:mm");
        };
  
        const shouldMerge = next && sameTime(current, next) && (
          (current.actionType === "UPDATE_PATIENT" && next.actionType === "SAVE_PATIENT_META_DATA") ||
          (current.actionType === "SAVE_PATIENT_META_DATA" && next.actionType === "UPDATE_PATIENT")
        );
  
        if (shouldMerge) {
          merged.push({
            ...current,
            contextualData: { ...current.contextualData, ...next.contextualData },
          });
          i++;
        } else {
          merged.push(current);
        }
      }
      return merged;
    }, []);
  
    const sortedActivities = useMemo(() => {
        
      const merged = mergePatientUpdateAndMetaActivities(activities || []);
      const attachmentsMap = new Map();
      const nonAttachments = [];
  
      for (const activity of merged) {
        if (activity.targetType === "ATTACHMENT") {
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
    };
  };