/**
 * Submissions Service Module
 * Handles all database operations via Supabase RPCs and Supabase Storage uploads.
 */

(function () {
  // Utility: Sanitize and format Supabase DB record to UI Submission Model
  function mapRecordToSubmission(row) {
    if (!row) return null;
    return {
      id: row.id,
      legacy_id: row.legacy_id || null,
      name: row.name || '',
      dept: row.dept || '',
      title: row.title || '',
      desc: row.description || '',
      url: row.project_url && row.project_url !== '#' ? row.project_url : '#',
      image: row.image_url || 'slides_media/slide_22.jpg',
      videoUrl: row.video_url || '',
      status: row.status || 'visible',
      votes: row.votes || 0,
      ratings: Array.isArray(row.ratings) ? row.ratings : [],
      date: row.created_at || new Date().toISOString(),
      updated_at: row.updated_at || new Date().toISOString()
    };
  }

  // Upload Media File to Supabase Storage 'submission-media' Bucket
  async function uploadMediaToStorage(file, folder = 'images') {
    const client = window.getSupabaseClient();
    if (!client) {
      throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
    }

    if (!file) return null;

    // Validate MIME types
    const allowedImages = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedVideos = ['video/mp4', 'video/webm', 'video/quicktime'];
    const isImage = allowedImages.includes(file.type);
    const isVideo = allowedVideos.includes(file.type);

    if (!isImage && !isVideo) {
      throw new Error('지원하지 않는 파일 형식입니다. (JPG, PNG, WEBP, MP4, WEBM만 허용)');
    }

    // Size check
    const maxImgSize = 10 * 1024 * 1024; // 10MB
    const maxVidSize = 100 * 1024 * 1024; // 100MB
    if (isImage && file.size > maxImgSize) {
      throw new Error('이미지 용량은 최대 10MB까지 업로드 가능합니다.');
    }
    if (isVideo && file.size > maxVidSize) {
      throw new Error('동영상 용량은 최대 100MB까지 업로드 가능합니다.');
    }

    // File Extension & Unique Name
    const ext = file.name.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || (isImage ? 'jpg' : 'mp4');
    const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    const filePath = `${folder}/${Date.now()}_${uuid}.${ext}`;

    const { data, error } = await client.storage
      .from('submission-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage Upload Error:', error);
      throw new Error(`파일 업로드 실패: ${error.message}`);
    }

    const { data: publicUrlData } = client.storage
      .from('submission-media')
      .getPublicUrl(filePath);

    return publicUrlData ? publicUrlData.publicUrl : null;
  }

  // Fetch All Visible Submissions
  async function fetchSubmissionsService() {
    const client = window.getSupabaseClient();
    if (!client) {
      return null;
    }

    const { data, error } = await client
      .from('submissions')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch Submissions Error:', error);
      throw new Error(`작품 목록 조회 실패: ${error.message}`);
    }

    return (data || []).map(mapRecordToSubmission);
  }

  // Create Submission via RPC
  async function createSubmissionService(formData) {
    const client = window.getSupabaseClient();
    if (!client) {
      throw new Error('중앙 저장소가 설정되지 않았습니다.');
    }

    let imageUrl = formData.image_url || null;
    let videoUrl = formData.video_url || null;

    // Handle Image Upload
    if (formData.imageFile) {
      imageUrl = await uploadMediaToStorage(formData.imageFile, 'images');
    }

    // Handle Video Upload
    if (formData.videoFile) {
      videoUrl = await uploadMediaToStorage(formData.videoFile, 'videos');
    }

    // Call RPC
    const { data, error } = await client.rpc('create_submission', {
      p_name: formData.name,
      p_dept: formData.dept,
      p_title: formData.title,
      p_description: formData.desc,
      p_project_url: formData.url && formData.url !== '#' ? formData.url : null,
      p_video_url: videoUrl,
      p_image_url: imageUrl,
      p_passcode: formData.passcode,
      p_legacy_id: formData.legacy_id || null
    });

    if (error) {
      console.error('Create Submission RPC Error:', error);
      throw new Error(error.message || '작품 등록 중 오류가 발생했습니다.');
    }

    const record = Array.isArray(data) ? data[0] : data;
    return mapRecordToSubmission(record);
  }

  // Update Submission With Passcode via RPC
  async function updateSubmissionService(submissionId, passcode, formData) {
    const client = window.getSupabaseClient();
    if (!client) {
      throw new Error('중앙 저장소가 설정되지 않았습니다.');
    }

    // Step 1 & 2: Upload new media files ONLY if newly provided
    let imageUrl = formData.image_url || null;
    let videoUrl = formData.video_url || null;

    if (formData.deleteVideo) {
      videoUrl = 'DELETE';
    } else if (formData.videoFile) {
      videoUrl = await uploadMediaToStorage(formData.videoFile, 'videos');
    }

    if (formData.deleteImage) {
      imageUrl = 'DELETE';
    } else if (formData.imageFile) {
      imageUrl = await uploadMediaToStorage(formData.imageFile, 'images');
    }

    // Step 3 & 4: Call RPC (Passing NULL preserves existing DB video_url/image_url)
    const { data, error } = await client.rpc('update_submission_with_passcode', {
      p_submission_id: submissionId,
      p_passcode: passcode,
      p_name: formData.name,
      p_dept: formData.dept,
      p_title: formData.title,
      p_description: formData.desc,
      p_project_url: formData.url && formData.url !== '#' ? formData.url : null,
      p_video_url: videoUrl,
      p_image_url: imageUrl
    });

    if (error) {
      console.error('Update Submission RPC Error:', error);
      if (error.message && error.message.includes('AUTH_FAILED')) {
        throw new Error('본인 확인 비밀번호가 일치하지 않습니다.');
      }
      throw new Error(error.message || '작품 수정 중 오류가 발생했습니다.');
    }

    const record = Array.isArray(data) ? data[0] : data;
    return mapRecordToSubmission(record);
  }

  // Delete Submission With Passcode via RPC
  async function deleteSubmissionService(submissionId, passcode) {
    const client = window.getSupabaseClient();
    if (!client) {
      throw new Error('중앙 저장소가 설정되지 않았습니다.');
    }

    const { data, error } = await client.rpc('delete_submission_with_passcode', {
      p_submission_id: submissionId,
      p_passcode: passcode
    });

    if (error) {
      console.error('Delete Submission RPC Error:', error);
      if (error.message && error.message.includes('AUTH_FAILED')) {
        throw new Error('본인 확인 비밀번호가 일치하지 않습니다.');
      }
      throw new Error(error.message || '작품 삭제 중 오류가 발생했습니다.');
    }

    return true;
  }

  // Admin Update Submission Status via RPC
  async function adminUpdateStatusService(submissionId, status) {
    const client = window.getSupabaseClient();
    if (!client) {
      throw new Error('중앙 저장소가 설정되지 않았습니다.');
    }

    const { data, error } = await client.rpc('admin_update_submission_status', {
      p_submission_id: submissionId,
      p_status: status
    });

    if (error) {
      console.error('Admin Update Status RPC Error:', error);
      throw new Error(error.message || '관리자 상태 변경 실패');
    }

    const record = Array.isArray(data) ? data[0] : data;
    return mapRecordToSubmission(record);
  }

  // Admin Delete Submission via RPC
  async function adminDeleteSubmissionService(submissionId) {
    const client = window.getSupabaseClient();
    if (!client) {
      throw new Error('중앙 저장소가 설정되지 않았습니다.');
    }

    const { data, error } = await client.rpc('admin_delete_submission', {
      p_submission_id: submissionId
    });

    if (error) {
      console.error('Admin Delete RPC Error:', error);
      throw new Error(error.message || '관리자 삭제 실패');
    }

    return true;
  }

  let activeRealtimeChannel = null;

  // Realtime Channel Subscription
  function subscribeToRealtimeSubmissions(onInsert, onUpdate, onDelete, onStatusChange) {
    const client = window.getSupabaseClient();
    if (!client) return null;

    // Clean up existing channel to prevent duplicate subscriptions
    if (activeRealtimeChannel) {
      try {
        client.removeChannel(activeRealtimeChannel);
      } catch (e) {
        console.warn('Failed to remove old channel:', e);
      }
      activeRealtimeChannel = null;
    }

    activeRealtimeChannel = client
      .channel('public:submissions:' + Date.now())
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'submissions' },
        (payload) => {
          if (payload.new && !payload.new.deleted_at && payload.new.status === 'visible') {
            if (typeof onInsert === 'function') onInsert(mapRecordToSubmission(payload.new));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'submissions' },
        (payload) => {
          if (payload.new) {
            const mapped = mapRecordToSubmission(payload.new);
            if (payload.new.deleted_at || payload.new.status === 'hidden') {
              if (typeof onDelete === 'function') onDelete(payload.new.id);
            } else {
              if (typeof onUpdate === 'function') onUpdate(mapped);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'submissions' },
        (payload) => {
          if (payload.old && payload.old.id) {
            if (typeof onDelete === 'function') onDelete(payload.old.id);
          }
        }
      )
      .subscribe((status, err) => {
        const badge = document.getElementById('realtimeSyncBadge');
        if (typeof onStatusChange === 'function') {
          onStatusChange(status, err);
        }
        if (badge) {
          if (status === 'SUBSCRIBED') {
            badge.textContent = '🟢 실시간 DB 연동 중';
            badge.style.background = 'rgba(16, 185, 129, 0.15)';
            badge.style.color = '#059669';
          } else if (status === 'TIMED_OUT') {
            badge.textContent = '⚠️ 실시간 연결 시간 초과 (재연결 시도 중)';
            badge.style.background = 'rgba(245, 158, 11, 0.15)';
            badge.style.color = '#d97706';
          } else if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
            badge.textContent = '⚠️ 실시간 DB 연결 끊김 (재연결 시도 중)';
            badge.style.background = 'rgba(239, 68, 68, 0.15)';
            badge.style.color = '#dc2626';
          } else {
            badge.textContent = '⏳ 중앙 DB 연결 확인 중...';
            badge.style.background = 'rgba(107, 114, 128, 0.15)';
            badge.style.color = '#4b5563';
          }
        }
      });

    return activeRealtimeChannel;
  }

  // Increment Vote via RPC
  async function incrementVoteService(submissionId) {
    const client = window.getSupabaseClient();
    if (!client) return null;

    const { data, error } = await client.rpc('increment_submission_vote', {
      p_submission_id: submissionId
    });

    if (error) {
      console.error('Increment Vote RPC Error:', error);
      throw new Error(error.message || '투표 반영 중 오류가 발생했습니다.');
    }

    const record = Array.isArray(data) ? data[0] : data;
    return mapRecordToSubmission(record);
  }

  // Decrement Vote via RPC
  async function decrementVoteService(submissionId) {
    const client = window.getSupabaseClient();
    if (!client) return null;

    const { data, error } = await client.rpc('decrement_submission_vote', {
      p_submission_id: submissionId
    });

    if (error) {
      console.error('Decrement Vote RPC Error:', error);
      throw new Error(error.message || '투표 취소 중 오류가 발생했습니다.');
    }

    const record = Array.isArray(data) ? data[0] : data;
    return mapRecordToSubmission(record);
  }

  // Export to window namespace
  window.SubmissionsService = {
    mapRecordToSubmission,
    uploadMediaToStorage,
    fetchSubmissions: fetchSubmissionsService,
    createSubmission: createSubmissionService,
    updateSubmission: updateSubmissionService,
    deleteSubmission: deleteSubmissionService,
    incrementVote: incrementVoteService,
    decrementVote: decrementVoteService,
    adminUpdateStatus: adminUpdateStatusService,
    adminDeleteSubmission: adminDeleteSubmissionService,
    subscribeToRealtimeSubmissions
  };
})();
