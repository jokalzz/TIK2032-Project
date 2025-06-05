<?php
include('./php/config.php');

session_start();

    // Check if images table is empty and insert sample images
    $check_images = "SELECT COUNT(*) as count FROM images";
    $result = $con->query($check_images);
    $row = $result->fetch_assoc();
    
    // If no images, insert sample images
    if ($row['count'] == 0) {
        // Create uploads directory if it doesn't exist
        if (!file_exists('uploads')) {
            mkdir('uploads', 0777, true);
        }
        
            
            // Save the image
            imagejpeg($img, 'uploads/' . $image['file_name']);
            imagedestroy($img);
            
            // Insert into database
            $title = $con->real_escape_string($image['title']);
            $description = $con->real_escape_string($image['description']);
            $file_name = $con->real_escape_string($image['file_name']);
            
            $sql = "INSERT INTO images (title, description, file_name) VALUES ('$title', '$description', '$file_name')";
            $con->query($sql);
        }

    // Process form submission for comments
    if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["submit_comment"])) {
        $image_id = $_POST["image_id"];
        $name = $con->real_escape_string($_POST["commenter_name"]);
        $comment = $con->real_escape_string($_POST["comment_text"]);
        
        $sql = "INSERT INTO comments (image_id, name, comment) VALUES ('$image_id', '$name', '$comment')";
        
        if ($con->query($sql) === TRUE) {
            // Reload page to show updated comments
            echo "<script>window.location.href = window.location.href;</script>";
        } else {
            echo "<script>alert('Error: " . $con->error . "');</script>";
        }
    }
    ?>
<head>
    <title>Gallery Photos</title>
        <link rel="stylesheet" href="gallery.css">
</head>
    <header>
        <div class="container">
            <a href="home.html" class="logo">JoKa</a>
        </div>
    </header>

    <div class="container">
        <div class="gallery-header">
            <h1>Gallery Photos</h1>
        </div>

        <div class="gallery-grid">
            <?php
            // Fetch images from database
            $sql = "SELECT * FROM images ORDER BY upload_date DESC";
            $result = $con->query($sql);

            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $image_id = $row["id"];
                    $title = htmlspecialchars($row["title"]);
                    $description = htmlspecialchars($row["description"]);
                    $file_name = htmlspecialchars($row["file_name"]);
                    $upload_date = date("d M Y", strtotime($row["upload_date"]));
                    
                    // Count comments for this image
                    $comment_sql = "SELECT COUNT(*) AS comment_count FROM comments WHERE image_id = '$image_id'";
                    $comment_result = $con->query($comment_sql);
                    $comment_count = 0;
                    
                    if ($comment_result && $comment_row = $comment_result->fetch_assoc()) {
                        $comment_count = $comment_row["comment_count"];
                    }
                    
                    echo '<div class="gallery-item">
                        <div class="gallery-img" data-image="uploads/' . $file_name . '">
                            <img src="uploads/' . $file_name . '" alt="' . $title . '">
                        </div>
                        <div class="gallery-info">
                            <h3 class="gallery-title">' . $title . '</h3>
                            <p class="gallery-date">' . $upload_date . '</p>
                            <p class="gallery-description">' . $description . '</p>
                            <div class="gallery-actions">
                                <button class="comment-btn" data-id="' . $image_id . '">
                                    <span>Komentar</span>
                                    <span class="comment-count">(' . $comment_count . ')</span>
                                </button>
                            </div>
                        </div>
                        <div class="comment-section" id="comment-section-' . $image_id . '">
                            <form class="comment-form" method="post" action="">
                                <input type="hidden" name="image_id" value="' . $image_id . '">
                                <div class="comment-form-group">
                                    <label for="commenter-name-' . $image_id . '">Nama Anda:</label>
                                    <input type="text" id="commenter-name-' . $image_id . '" name="commenter_name" required>
                                </div>
                                <div class="comment-form-group">
                                    <label for="comment-text-' . $image_id . '">Komentar:</label>
                                    <textarea id="comment-text-' . $image_id . '" name="comment_text" placeholder="Tulis komentar Anda..." required></textarea>
                                </div>
                                <button type="submit" name="submit_comment">Kirim Komentar</button>
                            </form>
                            <h4 style="margin: 20px 0 10px 0;">Komentar</h4>
                            <div class="comments-list">';
                    
                    // Fetch comments for this image
                    $comments_sql = "SELECT * FROM comments WHERE image_id = '$image_id' ORDER BY comment_date DESC";
                    $comments_result = $con->query($comments_sql);
                    
                    if ($comments_result && $comments_result->num_rows > 0) {
                        while($comment = $comments_result->fetch_assoc()) {
                            $commenter_name = htmlspecialchars($comment["name"]);
                            $comment_text = htmlspecialchars($comment["comment"]);
                            $comment_date = date("d M Y H:i", strtotime($comment["comment_date"]));
                            
                            echo '<div class="comment-item">
                                <div class="comment-header">
                                    <span class="comment-user">' . $commenter_name . '</span>
                                    <span class="comment-date">' . $comment_date . '</span>
                                </div>
                                <p class="comment-text">' . $comment_text . '</p>
                            </div>';
                        }
                    } else {
                        echo '<p class="no-comments">Belum ada komentar. Jadilah yang pertama!</p>';
                    }
                    
                    echo '</div>
                        </div>
                    </div>';
                }
            } else {
                echo '<div class="no-images">
                    <p>Tidak ada gambar yang tersedia.</p>
                </div>';
            }
            
            $con->close();
            ?>
        </div>
    </div>

    <!-- Image Modal for fullscreen view -->
    <div class="image-modal" id="imageModal">
        <div class="image-modal-content">
            <button class="close-image-modal" id="closeImageModal">&times;</button>
            <img id="modal-img" src="" alt="Gambar dalam ukuran penuh">
        </div>
    </div>

    <script>
        // Comment sections toggle
        const commentBtns = document.querySelectorAll('.comment-btn');
        commentBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const imageId = btn.getAttribute('data-id');
                const commentSection = document.getElementById(`comment-section-${imageId}`);
                
                // Close all other comment sections
                document.querySelectorAll('.comment-section.active').forEach(section => {
                    if (section !== commentSection) {
                        section.classList.remove('active');
                    }
                });
                
                // Toggle this comment section
                commentSection.classList.toggle('active');
            });
        });
        
        // Fullsize image modal
        const imageModal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modal-img');
        const closeImageModalBtn = document.getElementById('closeImageModal');
        const galleryImages = document.querySelectorAll('.gallery-img');
        
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                const imageSrc = img.getAttribute('data-image');
                modalImg.src = imageSrc;
                imageModal.classList.add('active');
            });
        });
        
        closeImageModalBtn.addEventListener('click', () => {
            imageModal.classList.remove('active');
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                imageModal.classList.remove('active');
            }
        });
    </script>
</body>
</html>